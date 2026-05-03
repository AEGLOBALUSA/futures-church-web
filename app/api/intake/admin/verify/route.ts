import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/intake/admin-auth";

export const runtime = "nodejs";

// POST /api/intake/admin/verify  → log out (clears session cookie).
// (The "verify" path is reserved for a future magic-link flow; today it just handles logout.)
export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
