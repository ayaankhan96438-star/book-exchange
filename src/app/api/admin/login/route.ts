import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, adminCookieOptions, createAdminToken, verifyAdminPassword } from "@/lib/admin-auth";

const schema = z.object({ password: z.string().min(1).max(256) });

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter the admin password." }, { status: 400 });
  if (!process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Set ADMIN_PASSWORD in the environment before using the admin panel." }, { status: 503 });
  if (!verifyAdminPassword(parsed.data.password)) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), adminCookieOptions);
  return response;
}
