import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken, markStartedIfNeeded } from "@/lib/intake/server";
import {
  createRepositoryPhoto,
  repoPhotoStoragePath,
} from "@/lib/intake/photo-repository";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { PHOTO_CATEGORIES, type PhotoCategory } from "@/lib/intake/sections";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 30 * 1024 * 1024;
const VALID_CATEGORIES = PHOTO_CATEGORIES.map((c) => c.value);

// POST /api/intake/photos — pastor uploads a photo to their campus's repository.
// Multipart: { token, file, category?, caption?, notes?, editedBy? }
export async function POST(req: NextRequest) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ error: "expected multipart form" }, { status: 400 });

  const token = fd.get("token");
  const file = fd.get("file");
  if (typeof token !== "string" || !(file instanceof Blob)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const campus = await getCampusByToken(token);
  if (!campus) return NextResponse.json({ error: "invalid token" }, { status: 401 });

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file too large (max 30MB)" }, { status: 413 });
  }

  await markStartedIfNeeded(campus.slug);

  const fileName = file instanceof File ? file.name : "photo";
  const storagePath = repoPhotoStoragePath(campus.slug, fileName);

  const supabase = createSupabaseServiceClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("intake")
    .upload(storagePath, Buffer.from(arrayBuffer), {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const categoryRaw = fd.get("category");
  const category: PhotoCategory =
    typeof categoryRaw === "string" && VALID_CATEGORIES.includes(categoryRaw as PhotoCategory)
      ? (categoryRaw as PhotoCategory)
      : "other";

  const captionRaw = fd.get("caption");
  const notesRaw = fd.get("notes");
  const uploadedByRaw = fd.get("editedBy");

  const photo = await createRepositoryPhoto({
    campusSlug: campus.slug,
    storagePath,
    fileName: fileName.replace(/[^a-zA-Z0-9._-]/g, "_"),
    mimeType: file.type,
    sizeBytes: file.size,
    caption: typeof captionRaw === "string" ? captionRaw.slice(0, 240) : undefined,
    category,
    notes: typeof notesRaw === "string" ? notesRaw.slice(0, 500) : undefined,
    uploadedBy: typeof uploadedByRaw === "string" ? uploadedByRaw.slice(0, 80) : undefined,
  });

  if (!photo) {
    return NextResponse.json({ error: "could not save photo" }, { status: 500 });
  }

  // Sign a fresh URL for immediate preview.
  const { data: signed } = await supabase.storage
    .from("intake")
    .createSignedUrl(storagePath, 3600);
  return NextResponse.json({ ok: true, photo: { ...photo, signedUrl: signed?.signedUrl ?? null } });
}
