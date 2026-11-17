"use client";

import { useState } from "react";
import { Check, Copy, MapPinned, MessageCircle, Phone } from "lucide-react";
import { ADDRESS, PHONE_NUMBER } from "@/lib/config";
import { whatsappLink } from "@/lib/whatsapp";

const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=H6+Krishna+Nagar+Delhi+110051";

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
