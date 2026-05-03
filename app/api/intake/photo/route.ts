import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken, deletePhoto } from "@/lib/intake/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// PATCH — update a photo's caption or sort order.
export async function PATCH(req: NextRequest) {
  let body: { token?: string; photoId?: string; caption?: string; sortOrder?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.token || !body.photoId) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const campus = await getCampusByToken(body.token);
  if (!campus) return NextResponse.json({ error: "invalid token" }, { status: 401 });

  const supabase = createSupabaseServiceClient();
  const updates: Record<string, unknown> = {};
  if (typeof body.caption === "string") updates.caption = body.caption.slice(0, 240);
  if (typeof body.sortOrder === "number") updates.sort_order = body.sortOrder;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no updates" }, { status: 400 });
  }
  const { error } = await supabase
    .from("intake_photo")
    .update(updates)
    .eq("id", body.photoId)
    .eq("campus_slug", campus.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE — remove a photo (and its storage object).
export async function DELETE(req: NextRequest) {
  let body: { token?: string; photoId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.token || !body.photoId) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const campus = await getCampusByToken(body.token);
  if (!campus) return NextResponse.json({ error: "invalid token" }, { status: 401 });

  const ok = await deletePhoto(body.photoId, campus.slug);
  if (!ok) return NextResponse.json({ error: "delete failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
