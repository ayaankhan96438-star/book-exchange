import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";

const requestSchema = z.object({
  isbn: z.string().trim().min(1).max(32),
});

type OpenLibraryBook = {
  title?: string;
  authors?: Array<{ name?: string }>;
  cover?: { large?: string; medium?: string; small?: string };
};

export async function POST(request: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter an ISBN-10 or ISBN-13." }, { status: 400 });
  }

  const isbn = parsed.data.isbn.replace(/[\s-]/g, "").toUpperCase();
  if (!/^(?:\d{9}[\dX]|\d{13})$/.test(isbn)) {
    return NextResponse.json({ error: "Enter a valid 10- or 13-character ISBN." }, { status: 400 });
  }

  const url = new URL("https://openlibrary.org/api/books");
  url.searchParams.set("bibkeys", `ISBN:${isbn}`);
  url.searchParams.set("format", "json");
  url.searchParams.set("jscmd", "data");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", "User-Agent": "BookExchangeAdmin/1.0" },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Open Library could not be reached. Please enter the details manually." },
        { status: 502 },
      );
    }

    const result = (await response.json()) as Record<string, OpenLibraryBook>;
    const book = result[`ISBN:${isbn}`];

    if (!book || (!book.title && !book.authors?.length && !book.cover)) {
      return NextResponse.json({ found: false, message: "Not found, enter manually" });
    }

    const author = (book.authors || [])
      .map((item) => item.name?.trim())
      .filter((name): name is string => Boolean(name))
      .join(", ");

    return NextResponse.json({
      found: true,
      book: {
        title: book.title?.trim() || "",
        author,
        coverUrl: book.cover?.medium || book.cover?.small || book.cover?.large || "",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not fetch details from Open Library. Please enter the details manually." },
      { status: 502 },
    );
  }
}
