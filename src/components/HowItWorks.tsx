import { BookOpen, Coins, HandHeart, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const steps = [
  { n: "01", icon: HandHeart, title: "Choose your books", text: "Browse the available collection and add the books you want to your reserve list." },
  { n: "02", icon: BookOpen, title: "Bring the same number", text: "Bring the same number of clean, complete books, up to 10 in one exchange." },
  { n: "03", icon: Coins, title: "Pay Rs 100", text: "Pay one flat exchange fee in cash or by UPI when we meet in person." },
  { n: "04", icon: MapPin, title: "Meet at the exchange point", text: "Visit H6, Krishna Nagar, Delhi 110051. Open daily 10:00 AM–10:00 PM; closed Friday." },
];

export default function HowItWorks() {
  return (
    <section className="section-pad mx-auto max-w-7xl px-5 lg:px-8">
      <FadeIn>
        <div className="max-w-2xl"><p className="eyebrow">A simple little ritual</p><h2 className="section-title mt-3">How the book exchange works</h2><p className="mt-4 leading-7 text-[#786D62]">Four easy steps. No delivery, no courier, and no online payment.</p></div>
      </FadeIn>
      <FadeIn>
        <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, icon: Icon, title, text }) => (
            <article key={n} className="how-card h-full rounded-2xl border border-[#E9DED0] bg-white p-6">
              <div className="flex items-center justify-between"><span className="font-serif text-3xl text-[#D5B99B]">{n}</span><span className="how-icon grid h-12 w-12 place-items-center rounded-2xl bg-[#F1E4D3] text-[#8B5E3C]"><Icon size={22} /></span></div>
              <h3 className="mt-7 font-serif text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6F6256]">{text}</p>
            </article>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
