"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  return (
    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="whatsapp-float hidden md:grid">
      <span className="whatsapp-pulse" aria-hidden="true" />
      <MessageCircle size={22} />
      <span className="whatsapp-tooltip">Chat with us</span>
    </a>
  );
}
