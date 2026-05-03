import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET /api/intake/admin/inbox?status=new&source=contact&limit=50
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const supabase = createSupabaseServiceClient();
  const status = req.nextUrl.searchParams.get("status");
  const source = req.nextUrl.searchParams.get("source");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 100);

  let q = supabase
    .from("inbox_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 500));
  if (status && status !== "all") q = q.eq("status", status);
  if (source && source !== "all") q = q.eq("source", source);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data ?? [] });
}

// PATCH /api/intake/admin/inbox  body: { id, status?, responded_by? }
export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { id?: string; status?: string; responded_by?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (body.status && ["new", "in-progress", "replied", "archived"].includes(body.status)) {
    updates.status = body.status;
    if (body.status === "replied") {
      updates.responded_at = new Date().toISOString();
      if (body.responded_by) updates.responded_by = body.responded_by;
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no updates" }, { status: 400 });
  }
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("inbox_messages").update(updates).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
