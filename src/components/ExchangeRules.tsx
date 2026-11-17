import { BookOpenCheck, Clock3, HandCoins, MapPin, Scale, Sparkles } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const rules = [
  { icon: Scale, title: "1 book ke badle 1 book", detail: "Bring 4, take 4. Choose any available title, even one with a higher retail value; the exchange stays one-for-one, with no per-book price balancing." },
  { icon: HandCoins, title: "Only ₹100 per exchange", detail: "The fee is ₹100 whether you exchange 1 book or 10. Pay in cash or UPI at the agreed exchange point." },
  { icon: BookOpenCheck, title: "Books must be in good condition", detail: "Books should be clean, complete, readable, and have all pages." },
  { icon: MapPin, title: "Public meetup only", detail: "We arrange an exchange point together over WhatsApp. We do not deliver or send books by courier." },
  { icon: Clock3, title: "48-hour reservation", detail: "Books reserved online are held for 48 hours. We will message you to arrange the exchange before your reservation expires." },
  { icon: Sparkles, title: "Maximum 10 books", detail: "You can exchange up to 10 books in one meetup." },
  { icon: BookOpenCheck, title: "Non-fiction books only", detail: "We accept only non-fiction books (self-help, finance, biography, history, study and similar). No novels or story books." },
];

export default function ExchangeRules() {
  return <section className="bg-[#F1E4D3]/55 py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><FadeIn><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Clear and simple</p><h2 className="section-title mt-3">Our exchange rules</h2><p className="mt-4 text-sm leading-7 text-[#786D62]">A fair exchange for every reader. Please read the rules before making a reservation.</p></div></FadeIn>
    <div className="mt-10 grid gap-4 md:grid-cols-2">{rules.map(({ icon: Icon, title, detail }, index) => <FadeIn key={title} delay={index * .04}><div className="flex gap-4 rounded-2xl border border-[#E7D8C6] bg-white p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F1E4D3] text-[#8B5E3C]"><Icon size={20} /></span><div><h3 className="font-semibold text-[#35281D]">{title}</h3><p className="mt-1.5 text-sm leading-6 text-[#80756A]">{detail}</p></div></div></FadeIn>)}</div>
  </div></section>;
}
