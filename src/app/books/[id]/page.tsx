import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { sampleBooks } from "@/lib/sample-data";
import BookDetailAction from "@/components/BookDetailAction";
import { ADDRESS } from "@/lib/config";
import { getOptimizedBookCover } from "@/lib/book-cover";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 60;

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let book: { id: string; title: string; author: string; genre: string; condition: string; coverUrl: string; status: string } | null = null;
  try { book = await prisma.book.findUnique({ where: { id } }); } catch { book = sampleBooks.find((item) => item.id === id) ?? null; }
  if (!book) notFound();

  const message = `Hi! I am interested in the book "${book.title}" by ${book.author}. Is it available for exchange?`;
  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B5E3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C]"><ArrowLeft size={16} /> Back to catalog</Link>
      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(250px,.8fr)_1.2fr]">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-[#F1E4D3] p-6">
          <Image src={getOptimizedBookCover(book.coverUrl)} alt={`Cover of ${book.title} by ${book.author}`} fill priority placeholder="empty" sizes="(max-width: 768px) 80vw, 360px" className="object-contain p-6" />
        </div>
        <div className="py-3">
          <p className="eyebrow">{book.genre}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#2B2118]">{book.title}</h1>
          <p className="mt-3 text-lg text-[#74675A]">by {book.author}</p>
          <div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full bg-[#F1E4D3] px-3 py-1.5 text-xs font-bold text-[#765033]">{book.condition.replaceAll("_", " ")}</span><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${book.status === "available" ? "bg-[#E7EBDD] text-[#526044]" : "bg-[#F5E3DF] text-[#9E5145]"}`}>{book.status === "available" ? "Available" : "Not available"}</span></div>
          <div className="mt-8 rounded-2xl border border-[#E9DED0] bg-white p-5">
            <div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-[#6F7B55]" size={20}/><div><h2 className="font-semibold">How to get this book</h2><p className="mt-1 text-sm leading-6 text-[#6F6256]">Reserve it online, bring the same number of books to the exchange point, and pay the flat Rs 100 exchange fee when we meet. Exchanges are in person at {ADDRESS}.</p></div></div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {book.status === "available" ? <BookDetailAction id={book.id} /> : <p className="text-sm text-[#9E5145]">This book is not currently available to reserve.</p>}
              <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="secondary-btn"><MessageCircle size={17}/> Ask about this book</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
