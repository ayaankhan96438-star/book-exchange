import { revalidatePath } from "next/cache";

/** Invalidate every public page whose output depends on available books or exchanges. */
export function revalidateBookPages() {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/reserve");
  revalidatePath("/books/[id]", "page");
}
