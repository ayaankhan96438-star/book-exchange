"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, BookOpen, Check, Clock3, ImagePlus, LogOut, Package, Pencil, Plus, RefreshCw, Trash2, TrendingUp, X } from "lucide-react";
import { BRAND_NAME } from "@/lib/config";
import { NON_FICTION_GENRES } from "@/lib/genres";

type AdminBook = { id: string; isbn: string | null; title: string; author: string; genre: string; condition: string; coverUrl: string; status: string; createdAt: string };
type AdminReservation = { id: string; name: string; phone: string; booksBringing: number; status: string; createdAt: string; expiresAt: string; books: { bookId: string; book: AdminBook }[] };
type Stats = { exchanges: number; earnings: number; availableBooks: number; pendingReservations: number };
type BookForm = { isbn: string; title: string; author: string; genre: string; condition: string; coverUrl: string; status: string };
type ReservationTimeDisplay = Record<string, { createdAt: string; remaining: string }>;
const emptyForm: BookForm = { isbn: "", title: "", author: "", genre: "Self Help", condition: "Good", coverUrl: "", status: "available" };


export default function AdminPanel({ initiallyAuthenticated }: { initiallyAuthenticated: boolean }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"overview" | "books" | "reservations">("overview");
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [stats, setStats] = useState<Stats>({ exchanges: 0, earnings: 0, availableBooks: 0, pendingReservations: 0 });
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [fetchingIsbn, setFetchingIsbn] = useState(false);
  const [isbnMessage, setIsbnMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [extraBookByReservation, setExtraBookByReservation] = useState<Record<string, string>>({});
  const [reservationTimeDisplay, setReservationTimeDisplay] = useState<ReservationTimeDisplay>({});

  const loadData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load admin data.");
      setBooks(data.books); setReservations(data.reservations); setStats(data.stats);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load data."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (authenticated) void loadData(); }, [authenticated, loadData]);

  useEffect(() => {
    const updateReservationTimes = () => {
      const now = Date.now();
      const formatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
      const next: ReservationTimeDisplay = {};
      for (const reservation of reservations) {
        const expiry = new Date(reservation.expiresAt).getTime();
        const millisecondsLeft = expiry - now;
        let remainingLabel = "Expired";
        if (millisecondsLeft > 0) {
          const hours = Math.floor(millisecondsLeft / 3_600_000);
          const minutes = Math.floor((millisecondsLeft % 3_600_000) / 60_000);
          remainingLabel = `${hours}h ${minutes}m left`;
        }
        next[reservation.id] = {
          createdAt: formatter.format(new Date(reservation.createdAt)),
          remaining: remainingLabel,
        };
      }
      setReservationTimeDisplay(next);
    };

    updateReservationTimes();
    const intervalId = window.setInterval(updateReservationTimes, 60_000);
    return () => window.clearInterval(intervalId);
  }, [reservations]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSaving(true);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      setAuthenticated(true); setPassword(""); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Login failed."); }
    finally { setSaving(false); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false); setBooks([]); setReservations([]); setTab("overview"); router.refresh();
  }

  async function saveBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setSaving(true);
    try {
      const endpoint = "/api/admin/books";
      const response = await fetch(endpoint, { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? { id: editingId, ...form } : form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save book.");
      setForm(emptyForm); setIsbnMessage(""); setEditingId(null); setNotice(editingId ? "Book updated." : "Book added."); await loadData();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save book."); }
    finally { setSaving(false); }
  }

  async function fetchIsbnDetails() {
    const normalizedIsbn = form.isbn.trim();
    if (!normalizedIsbn) {
      setIsbnMessage("Enter an ISBN first.");
      return;
    }

    setFetchingIsbn(true);
    setIsbnMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/books/fetch-isbn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: normalizedIsbn }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not fetch book details.");
      }
      if (!data.found) {
        setIsbnMessage("Not found, enter manually");
        return;
      }

      setForm((current) => ({
        ...current,
        title: data.book.title || current.title,
        author: data.book.author || current.author,
        coverUrl: data.book.coverUrl || current.coverUrl,
      }));
      setIsbnMessage("Details fetched. Review and edit the fields before saving.");
    } catch (err) {
      setIsbnMessage(err instanceof Error ? err.message : "Could not fetch book details.");
    } finally {
      setFetchingIsbn(false);
    }
  }

  async function uploadCover(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { setError("Choose an image under 5 MB."); return; }
    setUploading(true); setError("");
    try {
      const signatureResponse = await fetch("/api/admin/cloudinary-sign", { method: "POST" });
      const signatureData = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signatureData.error || "Cloudinary upload is not configured.");
      const body = new FormData(); body.append("file", file); body.append("api_key", signatureData.apiKey); body.append("timestamp", String(signatureData.timestamp)); body.append("folder", signatureData.folder); body.append("signature", signatureData.signature);
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, { method: "POST", body });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.error?.message || "Image upload failed.");
      setForm((current) => ({ ...current, coverUrl: uploadData.secure_url })); setNotice("Cover uploaded to Cloudinary.");
    } catch (err) { setError(err instanceof Error ? err.message : "Image upload failed."); }
    finally { setUploading(false); }
  }

  async function deleteBook(id: string) {
    if (!window.confirm("Delete this book from the catalog?")) return;
    setError("");
    const response = await fetch(`/api/admin/books?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Could not delete book."); else { setNotice("Book deleted."); await loadData(); }
  }

  async function changeStatus(book: AdminBook, status: string) {
    const response = await fetch("/api/admin/books", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: book.id, status }) });
    const data = await response.json(); if (!response.ok) setError(data.error || "Could not update status."); else await loadData();
  }

  async function updateReservation(id: string, action: "complete" | "cancel" | "add-books", bookIds: string[] = []) {
    setError(""); setNotice("");
    const response = await fetch(`/api/admin/reservations/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, bookIds }) });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Could not update reservation."); else { setNotice(action === "complete" ? "Exchange completed and logged." : action === "cancel" ? "Reservation cancelled; books released." : "Book added to reservation."); await loadData(); }
  }

  const pending = useMemo(() => reservations.filter((item) => item.status === "pending"), [reservations]);

  if (!authenticated) return <div className="mx-auto max-w-md rounded-3xl border border-[#E9DED0] bg-white p-8 shadow-book sm:p-10"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F1E4D3] text-[#8B5E3C]"><BookOpen size={26}/></div><p className="eyebrow mt-6 text-center">Staff access</p><h1 className="mt-2 text-center font-serif text-3xl font-semibold">Exchange admin</h1><p className="mt-3 text-center text-sm leading-6 text-[#80756A]">Sign in to manage the catalog, reservations, and local exchanges for {BRAND_NAME}.</p><form onSubmit={login} className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-xs font-bold">Admin password</span><input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>{error && <p role="alert" className="rounded-xl bg-[#FBECE8] p-3 text-xs text-[#9E5145]">{error}</p>}<button className="primary-btn w-full" disabled={saving}>{saving ? "Signing in…" : "Sign in"}</button></form><p className="mt-5 text-center text-[11px] text-[#A09589]">The admin password is configured in the server environment.</p></div>;

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Store management</p><h1 className="mt-2 font-serif text-3xl font-semibold">Admin dashboard</h1><p className="mt-1 text-sm text-[#80756A]">Manage books, reservations, and completed exchanges.</p></div><div className="flex gap-2"><button onClick={() => void loadData()} className="secondary-btn px-4 py-2.5"><RefreshCw size={15}/> Refresh</button><button onClick={logout} className="secondary-btn px-4 py-2.5"><LogOut size={15}/> Logout</button></div></div>
    {(error || notice) && <div className={`mt-5 flex items-start gap-2 rounded-xl p-3 text-sm ${error ? "bg-[#FBECE8] text-[#9E5145]" : "bg-[#E7EBDD] text-[#526044]"}`}>{error ? <AlertCircle size={17}/> : <Check size={17}/>}<span>{error || notice}</span><button className="ml-auto" onClick={() => { setError(""); setNotice(""); }} aria-label="Dismiss"><X size={16}/></button></div>}
    <div className="mt-8 flex flex-wrap gap-2 border-b border-[#E9DED0] pb-3">{(["overview", "books", "reservations"] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${tab === item ? "bg-[#8B5E3C] text-white" : "text-[#76695D] hover:bg-[#F1E4D3]"}`}>{item}{item === "reservations" && pending.length > 0 ? ` (${pending.length})` : ""}</button>)}</div>
    {loading && !books.length && <p className="py-12 text-center text-sm text-[#80756A]">Loading exchange data…</p>}
    {tab === "overview" && <div className="mt-7"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Total exchanges", value: stats.exchanges, icon: TrendingUp }, { label: "Total earnings", value: `₹${stats.earnings}`, icon: Package }, { label: "Books available", value: stats.availableBooks, icon: BookOpen }, { label: "Pending reservations", value: stats.pendingReservations, icon: Clock3 }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-[#E9DED0] bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#80756A]">{label}</p><Icon size={18} className="text-[#8B5E3C]"/></div><p className="mt-3 font-serif text-3xl font-semibold">{value}</p></div>)}</div><div className="mt-7 grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-[#E9DED0] bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-semibold">Recent reservations</h2><button onClick={() => setTab("reservations")} className="text-xs font-bold text-[#8B5E3C]">View all</button></div>{pending.slice(0, 5).length ? <div className="mt-4 space-y-3">{pending.slice(0, 5).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border-t border-[#F0E8DF] pt-3"><div><p className="text-sm font-semibold">{item.name}</p><p className="text-xs text-[#8D8175]">{item.booksBringing} bringing · {item.books.length} reserved</p></div><span className="text-xs font-semibold text-[#9B6840]">{reservationTimeDisplay[item.id]?.remaining ?? "—"}</span></div>)}</div> : <p className="mt-4 text-sm text-[#8D8175]">No pending reservations.</p>}</div><div className="rounded-2xl border border-[#E9DED0] bg-white p-6"><h2 className="font-serif text-xl font-semibold">Quick reminders</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-[#786D62]"><li>• One book brought equals one book taken.</li><li>• Flat ₹100 fee per completed exchange, paid at the exchange by cash or UPI.</li><li>• Reservations expire automatically after 48 hours.</li><li>• No delivery, courier, or online payments.</li></ul></div></div></div>}
    {tab === "books" && <div className="mt-7 grid gap-7 xl:grid-cols-[.75fr_1.25fr]"><section className="h-fit rounded-2xl border border-[#E9DED0] bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-semibold">{editingId ? "Edit book" : "Add a book"}</h2>{editingId && <button onClick={() => { setEditingId(null); setForm(emptyForm); setIsbnMessage(""); }} className="text-xs font-bold text-[#8B5E3C]">Cancel edit</button>}</div><form onSubmit={saveBook} className="mt-5 space-y-3"><div className="space-y-1.5"><label htmlFor="book-isbn" className="block text-xs font-bold">ISBN (optional)</label><div className="flex flex-col gap-2 sm:flex-row"><input id="book-isbn" className="input-field min-w-0 flex-1" value={form.isbn} onChange={(e) => { setForm((current) => ({ ...current, isbn: e.target.value })); setIsbnMessage(""); }} placeholder="Enter ISBN-10 or ISBN-13" inputMode="numeric" autoComplete="off"/><button type="button" onClick={() => void fetchIsbnDetails()} disabled={fetchingIsbn || !form.isbn.trim()} className="secondary-btn shrink-0 justify-center px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50">{fetchingIsbn ? <><RefreshCw size={15} className="animate-spin"/> Fetching…</> : <><RefreshCw size={15}/> Fetch details</>}</button></div>{isbnMessage && <p role="status" aria-live="polite" className={`text-xs ${isbnMessage.startsWith("Not found") || isbnMessage.includes("Enter ") || isbnMessage.includes("Could not") ? "text-[#9E5145]" : "text-[#61714D]"}`}>{isbnMessage}</p>}<p className="text-[11px] text-[#9A8D80]">Uses Open Library. You can review and edit all fields before saving.</p></div><label className="block"><span className="mb-1.5 block text-xs font-bold">Book title</span><input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required/></label><label className="block"><span className="mb-1.5 block text-xs font-bold">Author</span><input className="input-field" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required/></label><label className="block"><span className="mb-1.5 block text-xs font-bold">Non-fiction genre</span><select className="input-field" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required>{NON_FICTION_GENRES.map((genre) => <option key={genre} value={genre}>{genre}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="block"><span className="mb-1.5 block text-xs font-bold">Condition</span><select className="input-field" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}><option value="Good">Good</option><option value="Very_Good">Very Good</option><option value="Like_New">Like New</option></select></label><label className="block"><span className="mb-1.5 block text-xs font-bold">Status</span><select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="available">Available</option><option value="reserved">Reserved</option><option value="taken">Taken</option></select></label></div><label className="block"><span className="mb-1.5 block text-xs font-bold">Cover image URL</span><input className="input-field" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} placeholder="https://…" required/></label><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#CDB69D] bg-[#FBF6EE] px-4 py-3 text-sm font-semibold text-[#795337] hover:bg-[#F5EBDD]"><ImagePlus size={17}/>{uploading ? "Uploading…" : "Upload cover to Cloudinary"}<input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(e) => void uploadCover(e.target.files?.[0])}/></label>{form.coverUrl && <p className="break-all text-[10px] text-[#8A7B6D]">Cover URL saved: {form.coverUrl}</p>}<button disabled={saving || uploading} className="primary-btn w-full">{saving ? "Saving…" : editingId ? "Save changes" : <><Plus size={16}/> Add book</>}</button></form></section>
      <section><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-semibold">Catalog inventory</h2><span className="text-xs text-[#80756A]">{books.length} total</span></div><div className="mt-4 space-y-3">{books.length ? books.map((book) => <div key={book.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E9DED0] bg-white p-3"><div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F1E4D3]"><Image src={book.coverUrl} alt={`Cover of ${book.title}`} fill sizes="48px" className="object-contain p-1"/></div><div className="min-w-0 flex-1"><p className="line-clamp-1 text-sm font-semibold">{book.title}</p><p className="text-xs text-[#8D8175]">{book.author} · {book.condition.replaceAll("_", " ")}</p></div><select value={book.status} onChange={(e) => void changeStatus(book, e.target.value)} className="rounded-lg border border-[#E9DED0] bg-[#FBF6EE] px-2 py-2 text-xs"><option value="available">Available</option><option value="reserved">Reserved</option><option value="taken">Taken</option></select><button aria-label={`Edit ${book.title}`} onClick={() => { setEditingId(book.id); setIsbnMessage(""); setForm({ isbn: book.isbn || "", title: book.title, author: book.author, genre: book.genre, condition: book.condition, coverUrl: book.coverUrl, status: book.status }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-lg p-2 text-[#8B5E3C] hover:bg-[#F1E4D3]"><Pencil size={16}/></button><button aria-label={`Delete ${book.title}`} onClick={() => void deleteBook(book.id)} className="rounded-lg p-2 text-[#A35A4B] hover:bg-[#FBECE8]"><Trash2 size={16}/></button></div>) : <p className="rounded-2xl border border-dashed border-[#D8C5B1] p-10 text-center text-sm text-[#817568]">No books yet. Add your first book.</p>}</div></section></div>}
    {tab === "reservations" && <div className="mt-7"><h2 className="font-serif text-xl font-semibold">Reservations</h2><p className="mt-1 text-sm text-[#80756A]">Pending holds expire 48 hours after they are created. Complete only when books brought and books taken match.</p><div className="mt-5 space-y-4">{reservations.length ? reservations.map((item) => { const taking = item.books.length; const matches = item.booksBringing === taking; const isPending = item.status === "pending"; return <article key={item.id} className="rounded-2xl border border-[#E9DED0] bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.name}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${item.status === "pending" ? "bg-[#F5EBDD] text-[#946239]" : item.status === "completed" ? "bg-[#E7EBDD] text-[#526044]" : "bg-[#F2E8E5] text-[#8B5E3C]"}`}>{item.status}</span></div><p className="mt-1 text-xs text-[#8D8175]">Created {reservationTimeDisplay[item.id]?.createdAt ?? "—"}</p><div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold"><a href={`tel:${item.phone}`} className="text-[#8B5E3C]">Call {item.phone}</a><a href={`https://wa.me/91${item.phone}?text=${encodeURIComponent(`Hi ${item.name}, this is about your book exchange reservation.`)}`} target="_blank" rel="noopener noreferrer" className="text-[#61714D]">WhatsApp</a></div></div><div className="text-right text-xs text-[#8D8175]"><p>Reservation ID</p><p className="mt-1 font-mono text-[10px]">{item.id}</p>{isPending && <p className="mt-2 inline-flex items-center gap-1 font-bold text-[#9B6840]"><Clock3 size={13}/>{reservationTimeDisplay[item.id]?.remaining ?? "—"}</p>}</div></div><div className="mt-4 grid grid-cols-2 gap-3"><div className={`rounded-xl p-3 ${matches ? "bg-[#F5F1E9]" : "bg-[#FBECE8]"}`}><p className="text-[10px] font-bold uppercase tracking-wide text-[#8D8175]">Books bringing</p><p className="mt-1 font-serif text-2xl font-semibold">{item.booksBringing}</p></div><div className={`rounded-xl p-3 ${matches ? "bg-[#F5F1E9]" : "bg-[#FBECE8]"}`}><p className="text-[10px] font-bold uppercase tracking-wide text-[#8D8175]">Books taking</p><p className="mt-1 font-serif text-2xl font-semibold">{taking}</p></div></div>{!matches && isPending && <p className="mt-3 rounded-lg bg-[#FBECE8] px-3 py-2 text-xs font-semibold text-[#9E5145]">Counts do not match. One book in, one book out — match the final books-taken count with books brought before completing.</p>}{isPending && taking < item.booksBringing && <div className="mt-3 flex flex-wrap gap-2"><select value={extraBookByReservation[item.id] || ""} onChange={(e) => setExtraBookByReservation((old) => ({ ...old, [item.id]: e.target.value }))} className="min-w-0 flex-1 rounded-xl border border-[#E9DED0] bg-white px-3 py-2 text-xs"><option value="">Add an available book…</option>{books.filter((book) => book.status === "available").map((book) => <option key={book.id} value={book.id}>{book.title} — {book.author}</option>)}</select><button disabled={!extraBookByReservation[item.id]} onClick={() => { const choice = extraBookByReservation[item.id]; if (choice) void updateReservation(item.id, "add-books", [choice]); }} className="rounded-full border border-[#D8C5B1] px-4 py-2 text-xs font-bold text-[#795337] disabled:opacity-40">Add to reservation</button></div>}<div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-[#80756A]">{taking} reserved title{taking === 1 ? "" : "s"}: {item.books.map((link) => link.book.title).join(", ") || "No books"}</p>{isPending && <div className="flex gap-2"><button disabled={!matches} onClick={() => void updateReservation(item.id, "complete")} className="inline-flex items-center gap-2 rounded-full bg-[#6F7B55] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><Check size={14}/> Mark completed</button><button onClick={() => void updateReservation(item.id, "cancel")} className="inline-flex items-center gap-2 rounded-full border border-[#E6D4C7] px-4 py-2 text-xs font-bold text-[#8B5E3C] hover:bg-[#F8F0E6]"><X size={14}/> Cancel</button></div>}</div></article>; }) : <p className="rounded-2xl border border-dashed border-[#D8C5B1] p-10 text-center text-sm text-[#817568]">No reservations yet.</p>}</div></div>}
  </div>;
}
