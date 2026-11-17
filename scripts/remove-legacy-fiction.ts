import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());
const prisma = new PrismaClient();

const legacyIds = [
  "seed-9780062315007",
  "seed-9780547928227",
  "seed-9780141439518",
  "seed-9780451524935",
  "seed-9780060935467",
  "seed-9780590353427",
];

async function main() {
  const candidates = await prisma.book.findMany({
    where: {
      id: { in: legacyIds },
    },
    include: { reservations: { include: { reservation: { select: { status: true } } } } },
  });

  let deleted = 0;
  for (const book of candidates) {
    const hasPendingReservation = book.reservations.some((link) => link.reservation.status === "pending");
    if (hasPendingReservation) {
      console.warn(`Skipped "${book.title}" (${book.id}) because it is linked to a pending reservation.`);
      continue;
    }
    await prisma.book.delete({ where: { id: book.id } });
    deleted += 1;
    console.log(`Deleted legacy fiction book: ${book.title}`);
  }
  console.log(`Finished. Deleted ${deleted} legacy fiction book(s).`);
}

main().catch((error) => {
  console.error("Could not remove legacy fiction books:", error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
