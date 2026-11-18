export type SampleBook = {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: "Good" | "Very_Good" | "Like_New";
  coverUrl: string;
  status: "available" | "reserved" | "taken";
  createdAt: string;
};

const seeded = [
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

export const sampleBooks: SampleBook[] = seeded.map((book, index) => ({
  id: `sample-${index + 1}`,
  title: book[0],
  author: book[1],
  genre: book[2],
  condition: book[3],
  coverUrl: book[5],
  status: "available",
  createdAt: new Date(Date.parse("2026-01-01T00:00:00.000Z") - index * 86400000).toISOString(),
}));
