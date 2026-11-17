import FadeIn from "@/components/FadeIn";

const questions = [
  { q: "How many books can I bring?", a: "You can bring up to 10 books in one exchange. The number of books you take must match the number you bring." },
  { q: "What is the exchange fee?", a: "The fee is a flat Rs 100 per exchange, whether you exchange one book or ten. Pay in cash or by UPI when we meet." },
  { q: "What condition should my books be in?", a: "Books must be clean, readable, complete, and in good condition, with all pages present." },
  { q: "What genres do you accept?", a: "We accept books across genres, including non-fiction and fiction." },
  { q: "How does reservation work?", a: "Add available books to your reserve list and submit your details. A successful reservation holds the selected books for 48 hours." },
  { q: "Where do we meet?", a: "Exchanges take place in person at H6, Krishna Nagar, Delhi 110051. Open daily from 10:00 AM to 10:00 PM; closed on Fridays." },
  { q: "Do you deliver or courier books?", a: "No. We do not deliver or courier books. Every exchange happens in person at the exchange address." },
];

export default function FAQ() {
  return (
    <section className="section-pad bg-white" aria-labelledby="faq-title">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Good to know</p>
            <h2 id="faq-title" className="section-title mt-3">Frequently asked questions</h2>
          </div>
        </FadeIn>
        <div className="mt-9 divide-y divide-[#E9DED0] border-y border-[#E9DED0]">
          {questions.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#35281D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C] focus-visible:ring-offset-4">
                {q}
                <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F1E4D3] text-[#795337] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pt-3 pr-10 text-sm leading-7 text-[#786D62]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
