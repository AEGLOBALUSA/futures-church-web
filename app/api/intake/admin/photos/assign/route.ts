import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import {
  assignRepoPhotoToSlot,
  isSlotSectionKey,
} from "@/lib/intake/photo-repository";

export const runtime = "nodejs";

// POST /api/intake/admin/photos/assign — admin places a repository photo into a slot.
// Body: { campusSlug, repositoryPhotoId, sectionKey, caption?, sortOrder? }
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: {
    campusSlug?: string;
    repositoryPhotoId?: string;
    sectionKey?: string;
    caption?: string | null;
    sortOrder?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.campusSlug || !body.repositoryPhotoId || !body.sectionKey) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (!isSlotSectionKey(body.sectionKey)) {
    return NextResponse.json({ error: "invalid sectionKey" }, { status: 400 });
  }

  const result = await assignRepoPhotoToSlot({
    campusSlug: body.campusSlug,
    repositoryPhotoId: body.repositoryPhotoId,
    sectionKey: body.sectionKey,
    caption: body.caption ?? null,
    sortOrder: body.sortOrder,
    actorName: "admin",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  try {
    revalidatePath(`/campuses/${body.campusSlug}`);
    revalidatePath("/");
  } catch {
    /* noop */
  }

  return NextResponse.json({ ok: true });
}
