import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-auth";
import { NON_FICTION_GENRES } from "@/lib/genres";
import { revalidateBookPages } from "@/lib/revalidate-book-pages";

const condition = z.enum(["Good", "Very_Good", "Like_New"]);
const status = z.enum(["available", "reserved", "taken"]);
const genre = z.enum(NON_FICTION_GENRES, { error: "Invalid genre. Choose one of the allowed non-fiction genres." });
const createSchema = z.object({ isbn: z.string().trim().max(20).nullable().optional(), title: z.string().trim().min(1).max(180), author: z.string().trim().min(1).max(120), genre, condition, coverUrl: z.string().url(), status: status.default("available") });
const updateSchema = createSchema.partial().extend({ id: z.string().min(1) });

export async function POST(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  try {
    const book = await prisma.book.create({ data: { ...parsed.data, isbn: parsed.data.isbn?.trim() || null } });
    revalidateBookPages();
    return NextResponse.json({ book }, { status: 201 });
  }
  catch { return NextResponse.json({ error: "Could not add book. Check database connection and cover URL." }, { status: 503 }); }
}

export async function PATCH(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { id, isbn, ...data } = parsed.data;
  try {
    const book = await prisma.book.update({
      where: { id },
      data: { ...data, ...(isbn !== undefined ? { isbn: isbn?.trim() || null } : {}) },
    });
    revalidateBookPages();
    return NextResponse.json({ book });
  }
  catch { return NextResponse.json({ error: "Could not update this book." }, { status: 404 }); }
}

export async function DELETE(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let id = "";
  try { id = new URL(request.url).searchParams.get("id") || ""; } catch { /* ignore malformed URL */ }
  if (!id) return NextResponse.json({ error: "Book ID is required." }, { status: 400 });
  try { await prisma.book.delete({ where: { id } }); revalidateBookPages(); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Could not delete this book." }, { status: 404 }); }
}
