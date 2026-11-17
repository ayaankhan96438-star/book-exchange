import { prisma } from "@/lib/prisma";
import { sampleBooks } from "@/lib/sample-data";
import { releaseExpiredReservations } from "@/lib/reservations";

export async function getAvailableBooks() {
  try {
    await releaseExpiredReservations();
    const books = await prisma.book.findMany({
      where: { status: "available" },
      orderBy: { createdAt: "desc" },
    });
    return books.length ? books : (process.env.DATABASE_URL ? [] : sampleBooks);
  } catch {
    return sampleBooks;
  }
}

export async function getFeaturedBooks() {
  const books = await getAvailableBooks();
  return books.slice(0, 6);
}
