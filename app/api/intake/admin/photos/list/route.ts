import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import {
  listRepositoryPhotos,
  getSlotAssignments,
} from "@/lib/intake/photo-repository";

export const runtime = "nodejs";

// GET /api/intake/admin/photos/list?campus=<slug>
// Returns the campus's repository pool + current slot assignments.
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const campus = req.nextUrl.searchParams.get("campus");
  if (!campus) return NextResponse.json({ error: "missing campus" }, { status: 400 });

  const [pool, slots] = await Promise.all([
    listRepositoryPhotos(campus),
    getSlotAssignments(campus),
  ]);
  return NextResponse.json({ pool, slots });
}
