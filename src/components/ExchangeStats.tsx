"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";

function useCountUp(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

export default function ExchangeStats({ exchanges, books }: { exchanges: number; books: number }) {
  const exchangeCount = useCountUp(exchanges);
  const bookCount = useCountUp(books);
  if (exchanges <= 0 && books <= 0) return null;

  return (
    <section className="section-pad bg-[#F1E4D3]/55">
      <FadeIn>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-5 text-center lg:px-8">
          {exchanges > 0 && <div className="rounded-2xl bg-white p-6"><p className="font-serif text-4xl font-semibold text-[#8B5E3C]">{String(exchangeCount)}</p><p className="mt-2 text-sm text-[#786D62]">Completed exchanges</p></div>}
          {books > 0 && <div className="rounded-2xl bg-white p-6"><p className="font-serif text-4xl font-semibold text-[#8B5E3C]">{String(bookCount)}</p><p className="mt-2 text-sm text-[#786D62]">Books exchanged</p></div>}
        </div>
      </FadeIn>
    </section>
  );
}
