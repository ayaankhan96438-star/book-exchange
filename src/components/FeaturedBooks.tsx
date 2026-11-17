import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import BookCard, { type BookView } from "@/components/BookCard";

export default function FeaturedBooks({ books }: { books: BookView[] }) {
  return (
    <section className="section-pad mx-auto max-w-7xl px-5 lg:px-8">
      <FadeIn>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Recently listed</p><h2 className="section-title mt-3">Recently added non-fiction books</h2><p className="mt-3 text-sm text-[#786D62]">A few non-fiction reads waiting for their next reader.</p></div>
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-[#8B5E3C] hover:text-[#684329]">View all books <ArrowRight size={16} /></Link>
        </div>
      </FadeIn>
      {books.length ? (
        <FadeIn className="mt-9 h-full">
          <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {books.map((book, index) => <BookCard key={book.id} book={book} priority={index < 4} imageSizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />)}
          </div>
        </FadeIn>
      ) : <p className="mt-8 rounded-2xl border border-dashed border-[#D8C5B1] p-10 text-center text-sm text-[#817568]">New books are being added to the collection. Please check back soon.</p>}
    </section>
  );
}
