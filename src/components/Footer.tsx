import Link from "next/link";
import { BookOpen, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { ADDRESS, BRAND_NAME, INSTAGRAM_URL, PHONE_NUMBER } from "@/lib/config";
import { whatsappLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="mt-0 bg-[#2B2118] text-[#F8F1E8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-serif text-2xl font-bold"><BookOpen className="text-[#D7A979]" /> {BRAND_NAME}</div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#D1C4B6]">A small, home-run book exchange helping good books find their next reader. Browse, reserve, and meet us in person.</p>
          <p className="mt-5 text-xs uppercase tracking-[.2em] text-[#D7A979]">One book in. One book out.</p>
        </div>
        <div>
          <h3 className="font-semibold">Exchange Point</h3>
          <div className="mt-4 space-y-3 text-sm text-[#D1C4B6]">
            <p className="flex gap-3"><MapPin size={18} className="shrink-0 text-[#D7A979]" /> <span>{ADDRESS}</span></p>
            <p className="text-xs leading-6 text-[#B9AA9B]">Open daily 10:00 AM–10:00 PM; closed Friday. In-person exchanges only; no delivery or courier.</p>
            <Link href="/exchange-point" className="inline-flex text-sm font-semibold text-[#E5C39C] hover:text-white">View directions</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Explore</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#D1C4B6]">
            <Link href="/catalog" className="hover:text-white">Browse books</Link>
            <Link href="/reserve" className="hover:text-white">Your reserve list</Link>
            <Link href="/exchange-point" className="hover:text-white">Exchange Point</Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white"><MessageCircle size={16} /> Message us on WhatsApp</a>
            <a href={`tel:${PHONE_NUMBER}`} className="inline-flex items-center gap-2 hover:text-white"><Phone size={16} /> Call us</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Instagram size={16} /> Instagram</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-[#B9AA9B]">© {new Date().getFullYear()} {BRAND_NAME}. In-person book exchanges in Delhi.</div>
    </footer>
  );
}
