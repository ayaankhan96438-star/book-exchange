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

export const sampleBooks: SampleBook[] = seeded.map((book, index) => ({
  id: `sample-${index + 1}`,
  title: book[0],
  author: book[1],
  genre: book[2],
  condition: book[3],
  coverUrl: `https://covers.openlibrary.org/b/isbn/${book[4]}-M.jpg`,
  status: "available",
  createdAt: new Date(Date.now() - index * 86400000).toISOString(),
}));
