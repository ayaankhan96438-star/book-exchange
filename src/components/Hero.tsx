import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, MapPin, Sparkles } from "lucide-react";
import { ADDRESS, AREA, BRAND_NAME } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_10%,rgba(215,169,121,.22),transparent_40%),linear-gradient(135deg,#FBF6EE_0%,#F4EBDD_55%,#EADBC7_100%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_.95fr] md:pb-24 md:pt-20 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DFCBB5] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#795337]"><Sparkles size={14} /> Give every book another chapter</div>
          <h1 className="font-serif text-5xl font-semibold leading-[1.06] tracking-tight text-[#2B2118] sm:text-6xl lg:text-7xl">Bring your books.<br /><span className="text-[#8B5E3C]">Take the same number.</span><br />Only Rs 100.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#74675A] sm:text-lg">Exchange books with {BRAND_NAME}, a small home-run book exchange in {AREA}. Browse available books and arrange your in-person exchange with us on WhatsApp.</p>
          <p className="mt-3 max-w-xl text-xs leading-6 text-[#837669]">Browse a growing collection across genres, from self-help and business to fiction and more.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/catalog" className="primary-btn">Browse books <ArrowRight size={17} /></Link>
            <Link href="/exchange-point" className="secondary-btn"><MapPin size={17} /> Exchange Point</Link>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[#837669]">
            <span className="inline-flex items-center gap-2"><BookOpen size={15} className="text-[#8B5E3C]" /> One book in, one book out</span>
            <span>Up to 10 books per exchange</span>
            <span>{AREA}</span>
          </div>
          <p className="mt-5 text-xs leading-6 text-[#837669]">Meet in person at {ADDRESS}. We do not deliver or courier books.</p>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-8 top-10 h-44 w-44 rounded-full bg-[#D6B895]/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border-[10px] border-white/75 bg-[#DCC4A8] shadow-[0_30px_70px_rgba(80,52,30,.18)]">
            <div className="relative flex min-h-[400px] flex-col justify-end overflow-hidden sm:min-h-[500px]">
              <Image
                src="/images/book-exchange-hero.svg"
                alt="Illustration of a warm reading nook with a stack of non-fiction books"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(38,27,18,.02)_20%,rgba(38,27,18,.74)_100%)]" />
              <div className="relative z-10 p-7 sm:p-9">
                <span className="mb-3 inline-block w-fit rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-white backdrop-blur">A reader-run book exchange</span>
                <p className="max-w-sm font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">Your next non-fiction read is waiting for a new reader.</p>
                <p className="mt-3 text-sm text-white/85">Discover, exchange, repeat.</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-4 rounded-2xl border border-[#E8D9C8] bg-white px-5 py-4 shadow-xl sm:-left-8"><p className="font-serif text-2xl font-semibold text-[#8B5E3C]">Rs 100</p><p className="text-[11px] font-medium text-[#796B5E]">flat fee per exchange</p></div>
          <div className="absolute -right-3 top-8 rounded-2xl bg-[#6F7B55] px-4 py-3 text-white shadow-lg sm:-right-6"><p className="text-xs font-bold">48 HOURS</p><p className="text-[10px] text-white/80">reservation hold</p></div>
        </div>
      </div>
    </section>
  );
}
