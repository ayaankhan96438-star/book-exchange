"use client";

import Link from "next/link";
import { BookmarkCheck, MessageCircle } from "lucide-react";
import { useReserveList } from "@/components/ReserveContext";
import { whatsappLink } from "@/lib/whatsapp";

export default function MobileActionBar() {
  const { selectedIds } = useReserveList();
  return (
    <div className="mobile-action-bar md:hidden">
      <Link href="/reserve" className="mobile-action-primary">
        <BookmarkCheck size={17} /> Reserve list ({selectedIds.length})
      </Link>
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mobile-action-secondary" aria-label="Chat with us on WhatsApp">
        <MessageCircle size={19} />
      </a>
    </div>
  );
}
