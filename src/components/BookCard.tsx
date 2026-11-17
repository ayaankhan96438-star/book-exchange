"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Check, Plus } from "lucide-react";
import { useReserveList } from "@/components/ReserveContext";
import { getOptimizedBookCover } from "@/lib/book-cover";

export type BookView = {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: string;
  coverUrl: string;
  status: string;
};

export default function BookCard({ book, priority = false, imageSizes = "(min-width: 1280px) 220px, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw" }: { book: BookView; priority?: boolean; imageSizes?: string }) {
  const { selectedIds, addBook, removeBook } = useReserveList();
  const [coverFailed, setCoverFailed] = useState(false);
  const selected = selectedIds.includes(book.id);
  const condition = book.condition.replaceAll("_", " ");
  const hasCover = Boolean(book.coverUrl) && !coverFailed;

  return (
    <article className="book-card group">
      <Link
        href={`/books/${book.id}`}
        className="book-cover relative block aspect-[3/4] w-full shrink-0 overflow-hidden bg-[#F1E4D3]"
        aria-label={`View ${book.title}`}
      >
        {hasCover ? (
          <Image
            src={getOptimizedBookCover(book.coverUrl)}
            alt={`Cover of ${book.title} by ${book.author}`}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            placeholder="empty"
            sizes={imageSizes}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F1E4D3] px-4 text-center text-[#8B5E3C]">
            <BookOpen size={34} strokeWidth={1.5} aria-hidden="true" />
            <span className="line-clamp-3 max-w-full font-serif text-sm font-semibold leading-5">
              {book.title}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex h-6 min-w-0 items-center justify-between gap-2 overflow-hidden">
          <span className="block min-w-0 max-w-[48%] shrink truncate whitespace-nowrap rounded-full bg-[#F1E4D3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#765033]">
            {condition}
          </span>
          <span className="block min-w-0 max-w-[48%] truncate whitespace-nowrap text-right text-[11px] text-[#8C8074]">
            {book.genre}
          </span>
        </div>

        <Link
          href={`/books/${book.id}`}
          className="line-clamp-2 min-h-[3rem] font-serif text-lg font-semibold leading-6 text-[#2B2118] hover:text-[#8B5E3C]"
        >
          {book.title}
        </Link>
        <p className="mt-1 min-h-4 truncate whitespace-nowrap text-xs leading-4 text-[#80756A]">
          by {book.author}
        </p>

        <button
          onClick={() => (selected ? removeBook(book.id) : addBook(book.id))}
          className={`mt-auto inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full px-2.5 py-2.5 text-xs font-semibold transition ${selected ? "bg-[#E5E9DD] text-[#536044]" : "bg-[#8B5E3C] text-white hover:bg-[#71492D]"}`}
        >
          {selected ? (
            <>
              <Check size={15} className="shrink-0" />
              <span className="truncate">Added to reserve list</span>
            </>
          ) : (
            <>
              <Plus size={15} className="shrink-0" />
              <span className="truncate">Add to reserve list</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
