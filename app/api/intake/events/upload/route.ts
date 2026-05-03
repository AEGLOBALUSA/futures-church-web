import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken, getSignedPhotoUrl } from "@/lib/intake/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 30 * 1024 * 1024;

// POST /api/intake/events/upload — cover image for an event
// Returns { ok, storagePath, signedUrl } so the client can stash the path on
// the event record (via PATCH) and preview the image immediately.
export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "expected multipart form" }, { status: 400 });

  const token = formData.get("token");
  const file = formData.get("file");
  if (typeof token !== "string" || !(file instanceof Blob)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const campus = await getCampusByToken(token);
  if (!campus) return NextResponse.json({ error: "invalid token" }, { status: 401 });

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file too large (max 30MB)" }, { status: 413 });
  }

  const fileName = file instanceof File ? file.name : "cover";
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = safeName.includes(".") ? safeName.split(".").pop() : "jpg";
  const storagePath = `events/${campus.slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createSupabaseServiceClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("intake")
    .upload(storagePath, Buffer.from(arrayBuffer), {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const signedUrl = await getSignedPhotoUrl(storagePath, 3600);
  return NextResponse.json({ ok: true, storagePath, signedUrl });
}
