import type { Metadata } from "next";
import { BookOpenCheck, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { ABOUT, ADDRESS, AREA, OWNER_NAME } from "@/lib/config";
import ExchangePointActions from "@/components/ExchangePointActions";

export const metadata: Metadata = {
  title: { absolute: "Exchange Point" },
  description: `Visit our in-person non-fiction book exchange at ${ADDRESS}. The exact time is confirmed on WhatsApp. No delivery or courier service.`,
  openGraph: {
    title: { absolute: "Exchange Point" },
    description: `In-person non-fiction book exchanges at ${ADDRESS}.`,
  },
};

export default function ExchangePointPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow">Meet in person</p>
      <h1 className="section-title mt-3">Exchange Point</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#786D62]">Our home-run non-fiction book exchange is based in {AREA}. Exchanges happen in person at the address below. Exact time is confirmed on WhatsApp.</p>

      <div className="mt-9 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="space-y-5">
          <section className="rounded-3xl bg-white p-6 shadow-book">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F1E4D3] text-[#8B5E3C]"><MapPin size={21} /></span>
            <h2 className="mt-4 font-serif text-xl font-semibold">Our address</h2>
            <p className="mt-2 text-base font-semibold leading-7 text-[#35281D]">{ADDRESS}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-[#786D62]"><Clock3 size={16} /> Exact time is confirmed on WhatsApp</p>
            <p className="mt-3 text-sm leading-7 text-[#786D62]">We do not deliver books. Exchanges happen in person at this address.</p>
            <div className="mt-5"><ExchangePointActions /></div>
          </section>
          <section className="rounded-3xl bg-[#F7F0E3] p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#8B5E3C]"><BookOpenCheck size={21} /></span>
            <h2 className="mt-4 font-serif text-xl font-semibold">Before you message us</h2>
            <p className="mt-3 text-sm leading-7 text-[#66513C]">Please send us: 1) the names of the books you want, 2) the books you will exchange (names or clear photos). Books must be clean, with all pages present and in good condition. We accept non-fiction books only. Fee: Rs 100 per exchange, 1 book for 1 book.</p>
          </section>
        </div>

        <section className="overflow-hidden rounded-3xl bg-white p-2 shadow-book" aria-label="Map showing the exchange point">
          <iframe
            title="Google Map showing H6, Krishna Nagar, Delhi 110051"
            src="https://www.google.com/maps?q=H6+Krishna+Nagar+Delhi+110051&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[360px] w-full rounded-[1.25rem] border-0 sm:h-[480px] lg:h-full lg:min-h-[560px]"
          />
        </section>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-book">
          <h2 className="font-serif text-xl font-semibold">About the exchange</h2>
          <p className="mt-2 text-sm font-semibold text-[#55483C]">{OWNER_NAME}</p>
          <p className="mt-1 text-sm leading-6 text-[#786D62]">{ABOUT}</p>
        </section>
        <section className="rounded-3xl bg-[#2B2118] p-6 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-[#E5C39C]"><ShieldCheck size={21} /></span>
          <h2 className="mt-4 font-serif text-xl font-semibold">Simple, in-person exchange</h2>
          <p className="mt-2 text-sm leading-7 text-white/75">Bring up to 10 clean non-fiction books. Exchange one book for one book and pay Rs 100 in cash or by UPI when we meet. No delivery or courier service is available.</p>
        </section>
      </div>
    </main>
  );
}
