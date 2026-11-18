import { PrismaClient, BookCondition } from "@prisma/client";

const prisma = new PrismaClient();
const books = [
  ["Atomic Habits", "James Clear", "Self Help", "Like_New", "9780735211292", "/books/atomic-habits.jpg"],
  ["The Psychology of Money", "Morgan Housel", "Finance", "Very_Good", "9780857197689", "/books/the-psychology-of-money.jpg"],
  ["Ikigai", "Héctor García & Francesc Miralles", "Self Help", "Good", "9780143130727", "/books/ikigai.jpg"],
  ["Rich Dad Poor Dad", "Robert T. Kiyosaki", "Finance", "Very_Good", "9781612680194", "/books/rich-dad-poor-dad.jpg"],
  ["The Monk Who Sold His Ferrari", "Robin Sharma", "Self Help", "Good", "9780062515674", "/books/the-monk-who-sold-his-ferrari.jpg"],
  ["400 Days", "Chetan Bhagat", "Fiction", "Very_Good", "9781542094054", "/books/400-days.jpg"],
  ["Think and Grow Rich", "Napoleon Hill", "Business", "Very_Good", "9781585424337", "/books/think-and-grow-rich.jpg"],
  ["How to Win Friends and Influence People", "Dale Carnegie", "Self Help", "Good", "9780671027032", "/books/how-to-win-friends-and-influence-people.jpg"],
  ["The Power of Your Subconscious Mind", "Joseph Murphy", "Self Help", "Good", "9788192910963", "/books/the-power-of-your-subconscious-mind.jpg"],
  ["Black Holes", "Stephen Hawking", "Science & Technology", "Very_Good", "9780399179006", "/books/black-holes.jpg"],
  ["White Nights", "Fyodor Dostoevsky", "Fiction", "Very_Good", "9789363958128", "/books/white-nights.jpg"],
] as const;

async function main() {
  for (const [title, author, genre, condition, isbn, coverUrl] of books) {
    await prisma.book.upsert({
      where: { id: `seed-${isbn}` },
      update: { title, author, genre, isbn, coverUrl },
      create: {
        id: `seed-${isbn}`,
        isbn,
        title,
        author,
        genre,
        condition: condition as BookCondition,
        coverUrl,
      },
    });
  }
  console.log(`Seeded ${books.length} catalogue books.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => prisma.$disconnect());
