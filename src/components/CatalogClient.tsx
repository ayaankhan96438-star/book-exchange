"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import BookCard, { type BookView } from "@/components/BookCard";

export default function CatalogClient({ books }: { books: BookView[] }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All genres");
  const genres = useMemo(() => ["All genres", ...Array.from(new Set(books.map((book) => book.genre))).sort()], [books]);
  const filtered = useMemo(() => books.filter((book) => {
    const matchesQuery = `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = genre === "All genres" || book.genre === genre;
    return matchesQuery && matchesGenre;
  }), [books, genre, query]);

  return <div className="mt-9">
    <div className="grid gap-3 rounded-2xl border border-[#E9DED0] bg-white p-4 sm:grid-cols-[1fr_220px]">
      <label className="relative block"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D80]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by book title or author" className="input-field pl-11" /></label>
      <label className="relative block"><SlidersHorizontal size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D80]" /><select value={genre} onChange={(event) => setGenre(event.target.value)} className="input-field appearance-none pl-11"><option>All genres</option>{genres.filter((item) => item !== "All genres").map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <div className="mt-7 flex items-center justify-between"><p className="text-sm font-semibold text-[#55483C]">{filtered.length} {filtered.length === 1 ? "book" : "books"} found</p><p className="text-xs text-[#94877A]">Available for exchange</p></div>
    {filtered.length ? <div className="mt-5 grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((book, index) => <BookCard key={book.id} book={book} priority={index < 4} imageSizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-[#D8C5B1] bg-white/70 px-6 py-16 text-center"><Search className="mx-auto text-[#B9A38B]" size={28} /><h2 className="mt-4 font-serif text-xl font-semibold">No books found</h2><p className="mt-2 text-sm text-[#817568]">Try another title, author, or genre.</p></div>}
    <p className="mt-8 text-xs leading-6 text-[#94877A]">Catalog availability can change while you browse. A reservation is confirmed only after the server successfully holds the books for 48 hours.</p>
  </div>;
}
