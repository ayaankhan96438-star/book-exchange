"use client";

import { useState } from "react";
import { Check, Copy, MapPinned, MessageCircle, Phone } from "lucide-react";
import { ADDRESS, PHONE_NUMBER } from "@/lib/config";
import { whatsappLink } from "@/lib/whatsapp";

const directionsUrl = "https://www.google.com/maps/dir/28.6632453,77.2749852/codingbolt,+H6,+Block+H,+Krishna+Nagar,+Delhi,+110051/@28.6614437,77.2715343,15z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x390cfdc256fc3b7b:0xf7fed217f482e834!2m2!1d77.2840365!2d28.6576156!3e0?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D";

export default function ExchangePointActions() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="primary-btn">
        <MapPinned size={17} /> Get directions
      </a>
      <button type="button" onClick={copyAddress} className="secondary-btn">
        {copied ? <Check size={17} /> : <Copy size={17} />}
        {copied ? "Address copied" : "Copy address"}
      </button>
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="secondary-btn">
        <MessageCircle size={17} /> WhatsApp
      </a>
      <a href={`tel:${PHONE_NUMBER}`} className="secondary-btn">
        <Phone size={17} /> Call us
      </a>
    </div>
  );
}
