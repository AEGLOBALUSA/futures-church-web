import { NextResponse } from "next/server";
import { clearCampusEditorSession } from "@/lib/edit/auth";

export const runtime = "nodejs";

// POST /api/edit/logout — clears the campus editor cookie.
// (Senior admin uses /api/intake/admin/verify to log out their session.)
export async function POST() {
  await clearCampusEditorSession();
  return NextResponse.json({ ok: true });
}
