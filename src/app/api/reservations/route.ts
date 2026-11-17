import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { releaseExpiredReservations } from "@/lib/reservations";
import { revalidateBookPages } from "@/lib/revalidate-book-pages";

const reservationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number."),
  booksBringing: z.number().int().min(1).max(10),
  bookIds: z.array(z.string().min(1)).min(1).max(10),
}).refine((data) => new Set(data.bookIds).size === data.bookIds.length, {
  message: "A book can only appear once in the reserve list.",
  path: ["bookIds"],
}).refine((data) => data.bookIds.length <= data.booksBringing, {
  message: "One book in, one book out. You cannot reserve more books than you are bringing.",
  path: ["bookIds"],
});

export async function POST(request: Request) {
  try {
    const body = reservationSchema.parse(await request.json());
    const expiredCount = await releaseExpiredReservations();
    if (expiredCount > 0) revalidateBookPages();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const reservation = await prisma.$transaction(async (tx) => {
      const held = await tx.book.updateMany({
        where: { id: { in: body.bookIds }, status: "available" },
        data: { status: "reserved" },
      });
      if (held.count !== body.bookIds.length) {
        throw new Error("One or more selected books are no longer available. Refresh the catalog and try again.");
      }
      return tx.reservation.create({
        data: {
          name: body.name,
          phone: body.phone,
          createdAt: now,
          booksBringing: body.booksBringing,
          expiresAt,
          books: { create: body.bookIds.map((bookId) => ({ bookId })) },
        },
        select: { id: true, expiresAt: true },
      });
    });

    revalidateBookPages();
    return NextResponse.json({ id: reservation.id, expiresAt: reservation.expiresAt.toISOString() }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Please check your details." }, { status: 400 });
    const message = error instanceof Error ? error.message : "Could not create reservation.";
    const status = message.includes("no longer available") ? 409 : 503;
    return NextResponse.json({ error: message.includes("no such table") || message.includes("connect") ? "The exchange database is not connected yet. Configure DATABASE_URL, run the migration, and seed the books." : message }, { status });
  }
}
