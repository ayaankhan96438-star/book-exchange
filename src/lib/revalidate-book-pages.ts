import { revalidatePath } from "next/cache";

/** Invalidate all public pages whose output depends on book availability or reservations. */
export function revalidateBookPages() {
  revalidatePath("/", "page");
  revalidatePath("/catalog", "page");
  revalidatePath("/books/[id]", "page");
}
