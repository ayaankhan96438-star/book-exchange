import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedBooks from "@/components/FeaturedBooks";
import ExchangeRules from "@/components/ExchangeRules";
import { getFeaturedBooks } from "@/lib/books";
import type { BookView } from "@/components/BookCard";

export const revalidate = 60;

export default async function HomePage() {
  const books = await getFeaturedBooks();
  const viewBooks: BookView[] = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    condition: book.condition,
    coverUrl: book.coverUrl,
    status: book.status,
  }));
  return <main><Hero /><HowItWorks /><FeaturedBooks books={viewBooks} /><ExchangeRules /></main>;
}
