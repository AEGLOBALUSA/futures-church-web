import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, setAdminSession } from "@/lib/intake/admin-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.password) {
    return NextResponse.json({ error: "missing password" }, { status: 400 });
  }
  if (!checkAdminPassword(body.password)) {
    // Small delay so brute-forcing is annoying.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
