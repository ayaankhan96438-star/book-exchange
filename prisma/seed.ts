import { loadEnvConfig } from "@next/env";
import { PrismaClient, BookCondition } from "@prisma/client";

// Load the same .env.local configuration used by the Next.js app before Prisma connects.
loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

// These were included in the original sample catalog and are now prohibited.
// Do not remove a legacy sample book while it is attached to a pending reservation.
const legacyFictionSeedIds = [
  "seed-9780062315007",
  "seed-9780547928227",
  "seed-9780141439518",
  "seed-9780451524935",
  "seed-9780060935467",
  "seed-9780590353427",
] as const;

const books = [
  ["Atomic Habits", "James Clear", "Self Help", "Like_New", "9780735211292"],
  ["The Psychology of Money", "Morgan Housel", "Finance", "Very_Good", "9780857197689"],
  ["Ikigai", "Héctor García & Francesc Miralles", "Self Help", "Good", "9780143130727"],
  ["Rich Dad Poor Dad", "Robert T. Kiyosaki", "Finance", "Very_Good", "9781612680194"],
  ["Wings of Fire", "A.P.J. Abdul Kalam", "Biography", "Good", "9788173711466"],
  ["Sapiens", "Yuval Noah Harari", "History", "Very_Good", "9780062316097"],
  ["Think and Grow Rich", "Napoleon Hill", "Business", "Very_Good", "9781585424337"],
  ["The 7 Habits of Highly Effective People", "Stephen R. Covey", "Business", "Very_Good", "9781982137274"],
  ["How to Win Friends and Influence People", "Dale Carnegie", "Self Help", "Good", "9780671027032"],
  ["Deep Work", "Cal Newport", "Education and Study", "Like_New", "9781455586691"],
  ["The Power of Your Subconscious Mind", "Joseph Murphy", "Self Help", "Good", "9788192910963"],
  ["India After Gandhi", "Ramachandra Guha", "History", "Very_Good", "9780330505543"],
] as const;

async function removeLegacyFictionBooks() {
  for (const id of legacyFictionSeedIds) {
    const existing = await prisma.book.findUnique({
      where: { id },
      include: {
        reservations: {
          include: { reservation: { select: { status: true } } },
        },
      },
    });

    if (!existing) continue;

    const hasPendingReservation = existing.reservations.some(
      (link) => link.reservation.status === "pending",
    );

    if (hasPendingReservation) {
      console.warn(
        `WARNING: Skipping legacy fiction book ${id} (${existing.title}) because it is part of a pending reservation.`,
      );
      continue;
    }

    await prisma.book.delete({ where: { id } });
    console.log(`Removed legacy fiction book ${id} (${existing.title}).`);
  }
}

async function main() {
  await removeLegacyFictionBooks();

  for (const [title, author, genre, condition, isbn] of books) {
    const data = {
      isbn,
      title,
      author,
      genre,
      condition: condition as BookCondition,
      coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
    };

    await prisma.book.upsert({
      where: { id: `seed-${isbn}` },
      update: data,
      create: {
        id: `seed-${isbn}`,
        ...data,
      },
    });
  }

  console.log(`Seeded ${books.length} non-fiction sample books.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
