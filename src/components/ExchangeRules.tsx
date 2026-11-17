import { BookOpenCheck, Clock3, HandCoins, MapPin, Scale } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const rules = [
  { icon: Scale, title: "One book in, one book out", detail: "The number of books you bring must match the number you take." },
  { icon: HandCoins, title: "Rs 100 per exchange", detail: "One flat fee for the full exchange, paid in cash or by UPI when we meet." },
  { icon: BookOpenCheck, title: "Good condition, non-fiction only", detail: "Books must be clean, complete, and readable. No novels or story books." },
  { icon: MapPin, title: "In-person exchange only", detail: "Meet us at H6, Krishna Nagar, Delhi 110051. No delivery or courier service." },
  { icon: Clock3, title: "48-hour hold, maximum 10 books", detail: "Online reservations last 48 hours. You can exchange up to 10 books per visit." },
];

export default function ExchangeRules() {
  return (
    <section className="section-pad bg-[#F1E4D3]/55">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Clear and simple</p>
            <h2 className="section-title mt-3">Our exchange rules</h2>
            <p className="mt-4 text-sm leading-7 text-[#786D62]">A fair, one-for-one exchange for every reader.</p>
          </div>
        </FadeIn>
        <FadeIn>
          <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rules.map(({ icon: Icon, title, detail }) => (
              <article key={title} className="rule-card flex h-full gap-4 rounded-2xl border border-[#E7D8C6] bg-white p-5">
                <span className="rule-icon grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F1E4D3] text-[#8B5E3C]"><Icon size={20} /></span>
                <div><h3 className="font-semibold text-[#35281D]">{title}</h3><p className="mt-1.5 text-sm leading-6 text-[#6F6256]">{detail}</p></div>
              </article>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
