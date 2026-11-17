import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import BookCard, { type BookView } from "@/components/BookCard";

export default function FeaturedBooks({ books }: { books: BookView[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <FadeIn>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Recently listed</p>
            <h2 className="section-title mt-3">Recently added non-fiction books</h2>
            <p className="mt-3 text-sm text-[#786D62]">
              A few non-fiction reads waiting for their next reader.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8B5E3C] hover:text-[#684329]"
          >
            View all books <ArrowRight size={16} />
          </Link>
        </div>
      </FadeIn>

      {books.length ? (
        <div className="mt-9 grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {books.map((book, index) => (
            <FadeIn key={book.id} delay={index * 0.04} className="h-full">
              <BookCard
                book={book}
                priority={index < 4}
                imageSizes="(min-width: 1536px) 190px, (min-width: 1280px) 220px, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 45vw"
              />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-2xl border border-dashed border-[#D8C5B1] p-10 text-center text-sm text-[#817568]">
          New books are being added to the exchange collection. Please check back soon.
        </p>
      )}
    </section>
  );
}
