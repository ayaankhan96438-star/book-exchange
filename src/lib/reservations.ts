import { prisma } from "@/lib/prisma";

/** Expire overdue pending reservations and release any books still marked reserved. */
export async function releaseExpiredReservations() {
  const now = new Date();
  const overdue = await prisma.reservation.findMany({
    where: { status: "pending", expiresAt: { lte: now } },
    select: { id: true },
  });

  let expiredCount = 0;
  for (const item of overdue) {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.reservation.updateMany({
        where: { id: item.id, status: "pending", expiresAt: { lte: now } },
        data: { status: "expired" },
      });
      if (updated.count === 0) return;

      const links = await tx.reservationBook.findMany({
        where: { reservationId: item.id },
        select: { bookId: true },
      });
      const ids = links.map((link) => link.bookId);
      if (ids.length) {
        await tx.book.updateMany({
          where: { id: { in: ids }, status: "reserved" },
          data: { status: "available" },
        });
      }
      expiredCount += 1;
    });
  }
  return expiredCount;
}
