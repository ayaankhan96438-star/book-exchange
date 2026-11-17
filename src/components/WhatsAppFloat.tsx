import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/config";

export default function WhatsAppFloat() {
  return <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Message us on WhatsApp" className="fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#6F7B55] text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#596642]"><MessageCircle size={22} /></a>;
}
