"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkPlus, Check, ArrowRight } from "lucide-react";
import { useReserveList } from "@/components/ReserveContext";

export default function BookDetailAction({ id }: { id: string }) {
  const { selectedIds, addBook, removeBook } = useReserveList();
  const [added, setAdded] = useState(false);
  const selected = selectedIds.includes(id);
  return <div className="flex flex-col gap-3 sm:flex-row">
    <button onClick={() => { selected ? removeBook(id) : addBook(id); setAdded(!selected); }} className="primary-btn">{selected ? <><Check size={17}/> Added to reserve list</> : <><BookmarkPlus size={17}/> Add to reserve list</>}</button>
    {selected && <Link href="/reserve" className="secondary-btn">Continue <ArrowRight size={16}/></Link>}
  </div>;
}
