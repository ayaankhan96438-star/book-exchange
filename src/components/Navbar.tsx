"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Instagram, Menu, MessageCircle, X } from "lucide-react";
import { BRAND_NAME, INSTAGRAM_URL } from "@/lib/config";
import { whatsappLink } from "@/lib/whatsapp";

const links = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Browse books" },
  { href: "/exchange-point", label: "Exchange Point" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-[#E9DED0]/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#8B5E3C] text-white"><BookOpen size={21} /></span>
          <span className="font-serif text-xl font-bold tracking-tight text-[#2B2118]">{BRAND_NAME}<span className="text-[#8B5E3C]">.</span></span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className="nav-link text-sm font-medium text-[#65584C] hover:text-[#8B5E3C]">{link.label}</Link>)}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="rounded-full p-2 text-[#65584C] transition hover:bg-[#F1E4D3] hover:text-[#8B5E3C]"><Instagram size={18}/></a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="primary-btn px-5 py-2.5 text-sm"><MessageCircle size={16} /> WhatsApp</a>
        </div>
        <button className="rounded-lg p-2 text-[#2B2118] hover:bg-[#F1E4D3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C] md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>
      {open && <div className="border-t border-[#E9DED0] bg-[#FBF6EE] px-5 py-4 md:hidden">
        <div className="flex flex-col gap-4">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="nav-link w-fit text-sm font-semibold text-[#65584C]">{link.label}</Link>)}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#65584C]"><Instagram size={17} /> Instagram</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6F7B55]"><MessageCircle size={17} /> Message us on WhatsApp</a>
        </div>
      </div>}
    </header>
  );
}
