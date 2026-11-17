import AdminPanel from "@/components/AdminPanel";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = { title: "Exchange Admin | Book Exchange" };

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  return <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 lg:px-8"><AdminPanel initiallyAuthenticated={authenticated} /></main>;
}
