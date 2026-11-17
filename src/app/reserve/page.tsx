import type { Metadata } from "next";
import { getAvailableBooks } from "@/lib/books";
import ReserveClient from "@/components/ReserveClient";
import { BRAND_NAME } from "@/lib/config";

export const revalidate = 60;

export const metadata: Metadata = { title: "Reserve Books", description: `Reserve non-fiction books for an in-person exchange at H6, Krishna Nagar, Delhi 110051. No delivery or courier service.` };

export default async function ReservePage() {
  const available = await getAvailableBooks();
  const books = available.map((book) => ({ id: book.id, title: book.title, author: book.author, coverUrl: book.coverUrl }));
  return <main className="mx-auto min-h-[65vh] max-w-5xl px-5 py-12 lg:px-8"><p className="eyebrow">Hold your next read</p><h1 className="section-title mt-3">Your reserve list</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#786D62]">Choose the non-fiction books you want and tell us how many books you will bring. Exchanges take place at H6, Krishna Nagar, Delhi 110051. The exact time is confirmed on WhatsApp; reservations are held for 48 hours.</p><ReserveClient availableBooks={books} /></main>;
}
