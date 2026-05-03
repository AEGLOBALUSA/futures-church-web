import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken, addPhoto, getSignedPhotoUrl, markStartedIfNeeded } from "@/lib/intake/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 30 * 1024 * 1024; // 30 MB ceiling per file

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "expected multipart form" }, { status: 400 });
  }

  const token = formData.get("token");
  const sectionKey = formData.get("sectionKey");
  const editedBy = formData.get("editedBy");
  const file = formData.get("file");

  if (typeof token !== "string" || typeof sectionKey !== "string" || !(file instanceof Blob)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const campus = await getCampusByToken(token);
  if (!campus) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file too large (max 30MB)" }, { status: 413 });
  }

  await markStartedIfNeeded(campus.slug);

  const fileName = file instanceof File ? file.name : "upload";
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = safeName.includes(".") ? safeName.split(".").pop() : "bin";
  const storagePath = `${campus.slug}/${sectionKey}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createSupabaseServiceClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("intake")
    .upload(storagePath, Buffer.from(arrayBuffer), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const result = await addPhoto({
    campusSlug: campus.slug,
    sectionKey,
    storagePath,
    fileName: safeName,
    mimeType: file.type,
    sizeBytes: file.size,
    uploadedBy: typeof editedBy === "string" ? editedBy : null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const signedUrl = await getSignedPhotoUrl(storagePath, 3600);
  return NextResponse.json({ ok: true, photo: result.photo, signedUrl });
}
