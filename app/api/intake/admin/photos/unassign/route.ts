import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { unassignSlotPhoto } from "@/lib/intake/photo-repository";

export const runtime = "nodejs";

// POST /api/intake/admin/photos/unassign — remove a structural slot assignment.
// (The repository photo stays — only the placement is removed.)
// Body: { campusSlug, intakePhotoId }
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { campusSlug?: string; intakePhotoId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.campusSlug || !body.intakePhotoId) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const ok = await unassignSlotPhoto({
    campusSlug: body.campusSlug,
    intakePhotoId: body.intakePhotoId,
  });
  if (!ok) return NextResponse.json({ error: "unassign failed" }, { status: 500 });

  try {
    revalidatePath(`/campuses/${body.campusSlug}`);
    revalidatePath("/");
  } catch {
    /* noop */
  }

  return NextResponse.json({ ok: true });
}
