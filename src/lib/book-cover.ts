/** Prefer Open Library's medium cover variant; leave non-Open-Library URLs unchanged. */
export function getOptimizedBookCover(url: string): string {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "covers.openlibrary.org") {
      parsed.pathname = parsed.pathname.replace(/-L(?=\.jpe?g$)/i, "-M");
    }
    return parsed.toString();
  } catch {
    return url.replace(/-L(?=\.jpe?g(?:\?|$))/i, "-M");
  }
}
