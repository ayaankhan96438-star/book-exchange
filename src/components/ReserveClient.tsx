"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, Minus, Plus, Trash2 } from "lucide-react";
import { useReserveList } from "@/components/ReserveContext";
import { getOptimizedBookCover } from "@/lib/book-cover";
import { ADDRESS } from "@/lib/config";
import { whatsappLink } from "@/lib/whatsapp";

type ReserveBook = { id: string; title: string; author: string; coverUrl: string };

export default function ReserveClient({ availableBooks }: { availableBooks: ReserveBook[] }) {
  const { selectedIds, removeBook, clear } = useReserveList();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [booksBringing, setBooksBringing] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string; expiresAt: string; count: number } | null>(null);
  const [heldUntilLabel, setHeldUntilLabel] = useState("—");

  useEffect(() => {
    if (!success) {
      setHeldUntilLabel("—");
      return;
    }
    const formatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
    setHeldUntilLabel(formatter.format(new Date(success.expiresAt)));
  }, [success]);
  const selectedBooks = useMemo(() => selectedIds.map((id) => availableBooks.find((book) => book.id === id)).filter((book): book is ReserveBook => Boolean(book)), [availableBooks, selectedIds]);
  const missingCount = selectedIds.length - selectedBooks.length;
  const mismatch = selectedBooks.length > booksBringing;
  const phoneValid = /^\d{10}$/.test(phone);
  const valid = name.trim().length >= 2 && phoneValid && booksBringing >= 1 && booksBringing <= 10 && selectedBooks.length > 0 && !mismatch && missingCount === 0;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (mismatch) { setError(`One book in, one book out. You are bringing ${booksBringing} books, so you can take ${booksBringing} books.`); return; }
    if (!valid) { setError("Please complete all fields, use a valid 10-digit phone number, and choose up to the number of books you are bringing."); return; }
    setSubmitting(true);
    try {
      const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), phone, booksBringing, bookIds: selectedBooks.map((book) => book.id) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create reservation.");
      setSuccess({ id: data.id, expiresAt: data.expiresAt, count: selectedBooks.length });
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  }

  if (success) {
    const successMessage = `Hi! I just reserved books on your website. My name is ${name.trim()}. I will bring ${booksBringing} books. Please confirm the time and place for the exchange.`;
    return <div className="mt-9 rounded-3xl border border-[#D7E0CC] bg-white p-8 text-center shadow-book sm:p-12"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E7EBDD] text-[#5F704C]"><CheckCircle2 size={32}/></span><p className="eyebrow mt-6">Your books are on hold</p><h2 className="mt-2 font-serif text-3xl font-semibold">Reservation confirmed</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#786D62]">Your reservation is confirmed. Please message us on WhatsApp to confirm your exchange time. The flat Rs 100 fee is paid in cash or by UPI at the exchange.</p><div className="mx-auto mt-6 max-w-md rounded-2xl bg-[#F7F3EC] p-4 text-left text-sm"><p><strong>Reservation ID:</strong> {success.id}</p><p className="mt-2 flex items-center gap-2"><Clock3 size={16}/> <strong>Held until:</strong> {heldUntilLabel}</p><p className="mt-2 text-xs leading-5 text-[#786D62]">{success.count} books are held for you for 48 hours. You will bring {booksBringing} books, and the final exchange must remain one-for-one.</p></div><p className="mt-6 rounded-xl bg-[#F5F1E9] p-3 text-left text-xs leading-6 text-[#786D62]">Exchange address: <strong>{ADDRESS}</strong><br/>Open daily 10:00 AM–10:00 PM; closed Friday. We do not deliver books. Exchanges happen in person at this address.</p><p className="mt-3 text-xs leading-6 text-[#786D62]">We welcome books across genres, including fiction and non-fiction.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><a href={whatsappLink(successMessage)} target="_blank" rel="noopener noreferrer" className="primary-btn">Confirm on WhatsApp</a><a href="/catalog" className="secondary-btn">Browse more books</a></div></div>;
  }

  return <div className="mt-9 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
    <section><div className="flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold">Selected books</h2><span className="rounded-full bg-[#F1E4D3] px-3 py-1 text-xs font-bold text-[#765033]">{selectedBooks.length}/10</span></div>
      {selectedBooks.length ? <div className="mt-5 space-y-3">{selectedBooks.map((book) => <div key={book.id} className="flex items-center gap-4 rounded-2xl border border-[#E9DED0] bg-white p-3"><div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F1E4D3]"><Image src={getOptimizedBookCover(book.coverUrl)} alt={`Cover of ${book.title}`} fill loading="lazy" placeholder="empty" sizes="56px" className="object-contain p-1" /></div><div className="min-w-0 flex-1"><p className="line-clamp-2 font-serif font-semibold">{book.title}</p><p className="mt-1 text-xs text-[#80756A]">{book.author}</p></div><button type="button" aria-label={`Remove ${book.title}`} onClick={() => removeBook(book.id)} className="rounded-lg p-2 text-[#A36B5C] hover:bg-[#F8E9E4]"><Trash2 size={17}/></button></div>)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-[#D8C5B1] bg-white/70 p-10 text-center"><p className="font-serif text-xl font-semibold">Your list is empty</p><p className="mt-2 text-sm text-[#817568]">Go to the catalog and add the books you want to reserve.</p><a href="/catalog" className="secondary-btn mt-5">Browse catalog</a></div>}
      {missingCount > 0 && <p className="mt-3 rounded-xl bg-[#FBECE8] p-3 text-xs text-[#9E5145]">Some selected books are no longer available. Remove them and choose from the current catalog.</p>}
    </section>
    <section className="h-fit rounded-3xl border border-[#E9DED0] bg-white p-6 shadow-[0_8px_24px_rgba(68,45,26,.05)] sm:p-7"><h2 className="font-serif text-2xl font-semibold">Reservation details</h2><p className="mt-2 text-sm leading-6 text-[#80756A]">No online payment. We will hold your selected books for 48 hours after confirmation.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block"><span className="mb-2 block text-xs font-bold text-[#55483C]">Your name</span><input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" autoComplete="name" required minLength={2}/></label>
        <label className="block"><span className="mb-2 block text-xs font-bold text-[#55483C]">Phone number</span><input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel-national" required/><span className="mt-1 block text-[11px] text-[#9A8D80]">Enter 10 digits without +91.</span></label>
        <label className="block"><span className="mb-2 block text-xs font-bold text-[#55483C]">How many books will you bring?</span><div className="flex items-center gap-3"><button type="button" onClick={() => setBooksBringing((n) => Math.max(1, n - 1))} className="grid h-11 w-11 place-items-center rounded-xl border border-[#E3D7C9] text-[#6D5744]"><Minus size={16}/></button><input type="number" min={1} max={10} value={booksBringing} onChange={(e) => setBooksBringing(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} className="input-field text-center font-bold"/><button type="button" onClick={() => setBooksBringing((n) => Math.min(10, n + 1))} className="grid h-11 w-11 place-items-center rounded-xl border border-[#E3D7C9] text-[#6D5744]"><Plus size={16}/></button></div></label>
        <div className={`rounded-xl p-4 text-sm ${mismatch ? "bg-[#FBECE8] text-[#9E5145]" : "bg-[#F5F1E9] text-[#695B4D]"}`}><p className="font-semibold">Exchange balance</p><div className="mt-2 flex justify-between"><span>Books you bring</span><strong>{booksBringing}</strong></div><div className="mt-1 flex justify-between"><span>Books you reserve</span><strong>{selectedBooks.length}</strong></div><p className="mt-2 text-xs leading-5">One book in, one book out. You may reserve fewer books than you bring, but never more.</p>{mismatch && <p role="alert" className="mt-2 font-semibold">One book in, one book out. You are bringing {booksBringing} books, so you can take {booksBringing} books.</p>}</div>
        <div className="flex items-center justify-between border-t border-[#EEE5DB] pt-4 text-sm"><span className="text-[#786D62]">Flat fee at the exchange</span><strong className="text-lg">₹100</strong></div>
        {error && <p role="alert" className="flex items-start gap-2 rounded-xl bg-[#FBECE8] p-3 text-xs leading-5 text-[#9E5145]"><AlertCircle size={16} className="mt-0.5 shrink-0"/>{error}</p>}
        <button type="submit" disabled={!valid || submitting} className="primary-btn w-full">{submitting ? "Confirming…" : "Confirm reservation"}</button>
        <p className="text-center text-[11px] leading-5 text-[#95887B]">Reservation is held for 48 hours. Complete the exchange in person. Cash/UPI accepted at the exchange only.</p>
      </form>
    </section>
  </div>;
}
