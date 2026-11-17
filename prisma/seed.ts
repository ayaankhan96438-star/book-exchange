import { PrismaClient, BookCondition } from "@prisma/client";

const prisma = new PrismaClient();
const books = [
  ["Atomic Habits", "James Clear", "Self Help", "Like_New", "9780735211292"],
  ["The Alchemist", "Paulo Coelho", "Fiction", "Very_Good", "9780062315007"],
  ["The Hobbit", "J.R.R. Tolkien", "Fantasy", "Good", "9780547928227"],
  ["Pride and Prejudice", "Jane Austen", "Classic", "Very_Good", "9780141439518"],
  ["1984", "George Orwell", "Classic", "Good", "9780451524935"],
  ["To Kill a Mockingbird", "Harper Lee", "Fiction", "Like_New", "9780060935467"],
  ["The Psychology of Money", "Morgan Housel", "Finance", "Very_Good", "9780857197689"],
  ["Ikigai", "Héctor García & Francesc Miralles", "Self Help", "Good", "9780143130727"],
  ["Rich Dad Poor Dad", "Robert T. Kiyosaki", "Finance", "Very_Good", "9781612680194"],
  ["The Monk Who Sold His Ferrari", "Robin Sharma", "Self Help", "Good", "9780062515674"],
  ["Harry Potter and the Philosopher's Stone", "J.K. Rowling", "Fantasy", "Like_New", "9780590353427"],
  ["400 Days", "Chetan Bhagat", "Fiction", "Very_Good", "9781542094054"],
] as const;

async function main() {
  for (const [title, author, genre, condition, isbn] of books) {
    await prisma.book.upsert({
      where: { id: `seed-${isbn}` },
      update: {},
      create: {
        id: `seed-${isbn}`,
        title,
        author,
        genre,
        condition: condition as BookCondition,
        coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
      },
    });
  }
  console.log(`Seeded ${books.length} sample books.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => prisma.$disconnect());
