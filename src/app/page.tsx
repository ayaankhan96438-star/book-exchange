import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedBooks from "@/components/FeaturedBooks";
import ExchangeRules from "@/components/ExchangeRules";
import FAQ from "@/components/FAQ";
import ExchangeStats from "@/components/ExchangeStats";
import { getFeaturedBooks } from "@/lib/books";
import { prisma } from "@/lib/prisma";
import type { BookView } from "@/components/BookCard";

export const revalidate = 60;

export default async function HomePage() {
  const [books, exchangeCount, exchangedBooks] = await Promise.all([
    getFeaturedBooks(),
    prisma.exchange.count().catch(() => 0),
    prisma.exchange.aggregate({ _sum: { bookCount: true } }).then((result) => result._sum.bookCount ?? 0).catch(() => 0),
  ]);
  const viewBooks: BookView[] = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    condition: book.condition,
    coverUrl: book.coverUrl,
    status: book.status,
  }));
  return (
    <main>
      <Hero />
      <HowItWorks />
      <FeaturedBooks books={viewBooks} />
      <ExchangeStats exchanges={exchangeCount} books={exchangedBooks} />
      <ExchangeRules />
      <FAQ />
    </main>
  );
}
