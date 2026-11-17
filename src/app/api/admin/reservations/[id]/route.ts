import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { releaseExpiredReservations } from "@/lib/reservations";
import { requireAdminApi } from "@/lib/admin-auth";
import { revalidateBookPages } from "@/lib/revalidate-book-pages";

const schema = z.object({
  action: z.enum(["complete", "cancel", "add-books"]),
  bookIds: z.array(z.string().min(1)).max(10).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid reservation action." }, { status: 400 });
  const { id } = await params;
  try {
    const expiredCount = await releaseExpiredReservations();
    if (expiredCount > 0) revalidateBookPages();
    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({ where: { id }, include: { books: true } });
      if (!reservation || reservation.status !== "pending") throw new Error("This reservation is no longer pending.");
      if (reservation.expiresAt <= new Date()) throw new Error("This reservation has expired.");
      const bookIds = reservation.books.map((item) => item.bookId);

      if (parsed.data.action === "add-books") {
        const additions = parsed.data.bookIds || [];
        if (!additions.length || new Set(additions).size !== additions.length) throw new Error("Choose at least one different available book.");
        if (bookIds.length + additions.length > reservation.booksBringing) throw new Error(`1 book ke badle 1 book. The customer is bringing ${reservation.booksBringing} books, so they can take ${reservation.booksBringing} books total.`);
        if (additions.some((bookId) => bookIds.includes(bookId))) throw new Error("That book is already in this reservation.");
        const held = await tx.book.updateMany({ where: { id: { in: additions }, status: "available" }, data: { status: "reserved" } });
        if (held.count !== additions.length) throw new Error("One or more selected books are no longer available.");
        await tx.reservationBook.createMany({ data: additions.map((bookId) => ({ reservationId: id, bookId })) });
        return { status: "pending", added: additions.length };
      }

      if (parsed.data.action === "complete") {
        if (bookIds.length !== reservation.booksBringing) throw new Error(`1 book ke badle 1 book. This customer is bringing ${reservation.booksBringing} books but has ${bookIds.length} reserved. Match the counts before completing.`);
        const updated = await tx.book.updateMany({ where: { id: { in: bookIds }, status: "reserved" }, data: { status: "taken" } });
        if (updated.count !== bookIds.length) throw new Error("One or more reserved books are no longer marked reserved.");
        await tx.exchange.create({ data: { bookCount: bookIds.length, fee: 100 } });
        await tx.reservation.update({ where: { id }, data: { status: "completed" } });
        return { status: "completed" };
      }

      await tx.reservation.update({ where: { id }, data: { status: "cancelled" } });
      if (bookIds.length) await tx.book.updateMany({ where: { id: { in: bookIds }, status: "reserved" }, data: { status: "available" } });
      return { status: "cancelled" };
    });
    revalidateBookPages();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update reservation.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
