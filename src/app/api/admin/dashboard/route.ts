import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { releaseExpiredReservations } from "@/lib/reservations";
import { requireAdminApi } from "@/lib/admin-auth";
import { revalidateBookPages } from "@/lib/revalidate-book-pages";

export async function GET() {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const expiredCount = await releaseExpiredReservations();
    if (expiredCount > 0) revalidateBookPages();
    const [books, reservations, exchanges, earnings, availableBooks, pendingReservations] = await Promise.all([
      prisma.book.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.reservation.findMany({ include: { books: { include: { book: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.exchange.count(),
      prisma.exchange.aggregate({ _sum: { fee: true } }),
      prisma.book.count({ where: { status: "available" } }),
      prisma.reservation.count({ where: { status: "pending" } }),
    ]);
    return NextResponse.json({ books, reservations, stats: { exchanges, earnings: earnings._sum.fee || 0, availableBooks, pendingReservations } });
  } catch {
    return NextResponse.json({ error: "Could not load admin data. Check your database connection and migration." }, { status: 503 });
  }
}
