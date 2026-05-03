import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getEditorScope, canEditCampus } from "@/lib/edit/auth";
import { saveResponse, markStartedIfNeeded } from "@/lib/intake/server";

export const runtime = "nodejs";

// POST /api/edit/save — inline-edit save endpoint.
// Auth: 30-day editor cookie (campus-scoped) OR senior admin password session.
// Body: { campusSlug, sectionKey, fieldKey, value, editedBy? }
//
// Writes to intake_response (the same table the intake form uses), so inline
// edits and intake-portal edits stay in sync. Revalidates the affected campus
// page so visitors see changes within ~2 seconds.
export async function POST(req: NextRequest) {
  const scope = await getEditorScope();
  if (!scope) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  let body: {
    campusSlug?: string;
    sectionKey?: string;
    fieldKey?: string;
    value?: unknown;
    editedBy?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.campusSlug || !body.sectionKey || !body.fieldKey) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  if (!canEditCampus(scope, body.campusSlug)) {
    return NextResponse.json({ error: "not authorized for this campus" }, { status: 403 });
  }

  // Determine actor name for audit trail.
  const actorName =
    typeof body.editedBy === "string" && body.editedBy.trim()
      ? body.editedBy.trim().slice(0, 80)
      : scope.kind === "admin"
      ? "admin"
      : null;

  await markStartedIfNeeded(body.campusSlug);

  const result = await saveResponse({
    campusSlug: body.campusSlug,
    sectionKey: body.sectionKey,
    fieldKey: body.fieldKey,
    value: body.value ?? null,
    editedBy: actorName,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // On-demand revalidation — campus page updates within ~2s.
  try {
    revalidatePath(`/campuses/${body.campusSlug}`);
  } catch {
    /* noop in environments without cache module */
  }

  return NextResponse.json({ ok: true, lastEditedAt: result.lastEditedAt });
}
