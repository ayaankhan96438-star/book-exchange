import { BookOpen, Coins, HandHeart, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const steps = [
  { n: "01", icon: HandHeart, title: "Bring your books to the exchange point", text: "Bring clean, readable non-fiction books to the public meeting place confirmed with you on WhatsApp." },
  { n: "02", icon: BookOpen, title: "Choose the same number", text: "Pick the same number of available non-fiction books from the online collection." },
  { n: "03", icon: Coins, title: "Pay Rs 100 at the exchange", text: "One flat fee per exchange, whether you swap 1 book or 10. Pay in cash or UPI when we meet." },
  { n: "04", icon: MapPin, title: "Take them home", text: "Complete the exchange in person at the agreed public meeting place and enjoy your new reads." },
];

export default function HowItWorks() {
  return <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><FadeIn><div className="max-w-2xl"><p className="eyebrow">A simple little ritual</p><h2 className="section-title mt-3">How book exchange works</h2><p className="mt-4 leading-7 text-[#786D62]">Four easy steps. No delivery, no online payment, and no complicated points system.</p></div></FadeIn>
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step, i) => { const Icon = step.icon; return <FadeIn key={step.n} delay={i * .07}><div className="h-full rounded-2xl border border-[#E9DED0] bg-white p-6 shadow-[0_8px_20px_rgba(68,45,26,.04)]"><div className="flex items-center justify-between"><span className="font-serif text-3xl text-[#D5B99B]">{step.n}</span><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F1E4D3] text-[#8B5E3C]"><Icon size={22} /></span></div><h3 className="mt-7 font-serif text-xl font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#80756A]">{step.text}</p></div></FadeIn>; })}</div>
  </section>;
}
