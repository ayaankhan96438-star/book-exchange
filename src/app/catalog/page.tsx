import type { Metadata } from "next";
import { getAvailableBooks } from "@/lib/books";
import type { BookView } from "@/components/BookCard";
import CatalogClient from "@/components/CatalogClient";
import { AREA, BRAND_NAME } from "@/lib/config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Browse Non-fiction Books",
  description: `Browse non-fiction books available for local exchange through ${BRAND_NAME} in ${AREA}. Reserve online and arrange a public meetup over WhatsApp.`,
};

export default async function CatalogPage() {
  const books = await getAvailableBooks();
  const viewBooks: BookView[] = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    condition: book.condition,
    coverUrl: book.coverUrl,
    status: book.status,
  }));
  return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12 lg:px-8">
    <p className="eyebrow">Browse the collection</p>
    <h1 className="section-title mt-3">Explore non-fiction books</h1>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#786D62]">Find your next read, add it to your reserve list, and we will message you to arrange a public exchange. Only available non-fiction books appear here.</p>
    <CatalogClient books={viewBooks} />
  </main>;
}
