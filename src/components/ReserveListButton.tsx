"use client";

import Link from "next/link";
import { BookmarkCheck } from "lucide-react";
import { useReserveList } from "@/components/ReserveContext";

export default function ReserveListButton() {
  const { selectedIds } = useReserveList();
  if (!selectedIds.length) return null;
  return (
    <Link href="/reserve" className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#2B2118] px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#4A3324]">
      <BookmarkCheck size={17} /> Reserve list <span className="rounded-full bg-white/15 px-2 py-0.5">{selectedIds.length}</span>
    </Link>
  );
}
