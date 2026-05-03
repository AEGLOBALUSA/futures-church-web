import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { reorderGallery } from "@/lib/intake/photo-repository";

export const runtime = "nodejs";

// POST /api/intake/admin/photos/reorder
// Body: { campusSlug, orderedIds: string[] }
// Persists gallery sort order from a list of intake_photo ids in desired order.
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { campusSlug?: string; orderedIds?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.campusSlug || !Array.isArray(body.orderedIds)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  await reorderGallery(body.campusSlug, body.orderedIds);
  try {
    revalidatePath(`/campuses/${body.campusSlug}`);
  } catch {
    /* noop */
  }
  return NextResponse.json({ ok: true });
}
