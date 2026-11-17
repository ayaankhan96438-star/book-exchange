import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import { ABOUT, AREA, BRAND_NAME, OWNER_NAME, PHONE_NUMBER, WHATSAPP_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: `Exchange Point | ${BRAND_NAME}`,
  description: `Learn about the reader-run book exchange in ${AREA}, meet the owner, and arrange a public meetup over WhatsApp.`,
};

export default function ExchangePointPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-4xl px-5 py-12 lg:px-8">
      <p className="eyebrow">A local, reader-run exchange</p>
      <h1 className="section-title mt-3">Exchange Point</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#786D62]">This is a small home-run book exchange, not a public storefront. We share only the general area here; after you reserve, we will confirm a public meeting place and time with you on WhatsApp.</p>

      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        <section className="rounded-3xl border border-[#E9DED0] bg-white p-6 shadow-book">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F1E4D3] text-[#8B5E3C]"><MapPin size={21} /></span>
          <h2 className="mt-4 font-serif text-xl font-semibold">General area</h2>
          <p className="mt-2 text-sm leading-6 text-[#786D62]">{AREA}</p>
        </section>
        <section className="rounded-3xl border border-[#E9DED0] bg-white p-6 shadow-book">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F1E4D3] text-[#8B5E3C]"><UserRound size={21} /></span>
          <h2 className="mt-4 font-serif text-xl font-semibold">About me</h2>
          <p className="mt-2 text-sm font-semibold text-[#55483C]">{OWNER_NAME}</p>
          <p className="mt-1 text-sm leading-6 text-[#786D62]">{ABOUT}</p>
        </section>
      </div>

      <section className="mt-5 rounded-3xl bg-[#2B2118] p-6 text-white sm:p-8">
        <h2 className="font-serif text-2xl font-semibold">Let’s arrange your exchange</h2>
        <p className="mt-2 text-sm leading-6 text-white/75">Message us after reserving, or call if you have a question.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#6F7B55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#596642]"><MessageCircle size={17} /> Message us on WhatsApp</a>
          {PHONE_NUMBER ? <a href={`tel:${PHONE_NUMBER}`} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"><Phone size={17} /> Call us</a> : <button type="button" disabled title="Add NEXT_PUBLIC_PHONE_NUMBER to enable calling" className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/60"><Phone size={17} /> Call us</button>}
        </div>
      </section>

      <p className="mt-5 flex gap-3 rounded-2xl border border-[#D9C7A9] bg-[#F7F0E3] p-5 text-sm leading-7 text-[#66513C]"><ShieldCheck size={20} className="mt-1 shrink-0 text-[#8B5E3C]" /><span>Exact meeting place and time will be confirmed on WhatsApp after you reserve. We meet in public places.</span></p>
    </main>
  );
}
