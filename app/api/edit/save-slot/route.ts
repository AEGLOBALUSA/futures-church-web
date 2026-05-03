import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getEditorScope } from "@/lib/edit/auth";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SLOT_REGISTRY } from "@/lib/content/slots/registry";

export const runtime = "nodejs";

// POST /api/edit/save-slot — site-wide content slot save endpoint.
// Auth: senior-admin cookie only. Campus-scoped editors can't write to
// site-wide slots (only their campus pages via /api/edit/save).
//
// Body: { slotId, value, owner?, editedBy? }
//
// Writes to content_slot, appends to content_slot_history, revalidates
// the affected page. Status auto-derived: empty → draft → filled based
// on whether the value is meaningfully populated.
export async function POST(req: NextRequest) {
  const scope = await getEditorScope();
  if (!scope || scope.kind !== "admin") {
    return NextResponse.json(
      { error: "admin sign-in required for site-wide slots" },
      { status: 401 }
    );
  }

  let body: {
    slotId?: string;
    value?: string;
    owner?: string;
    editedBy?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.slotId || typeof body.slotId !== "string") {
    return NextResponse.json({ error: "missing slotId" }, { status: 400 });
  }
  if (typeof body.value !== "string") {
    return NextResponse.json({ error: "missing value" }, { status: 400 });
  }

  const definition = SLOT_REGISTRY.find((s) => s.id === body.slotId);
  if (!definition) {
    return NextResponse.json(
      { error: `unknown slot id: ${body.slotId}` },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "supabase not configured" },
      { status: 500 }
    );
  }

  const supabase = createSupabaseServiceClient();
  const trimmed = body.value.trim();
  const status: "empty" | "filled" = trimmed.length === 0 ? "empty" : "filled";
  const owner = body.owner?.trim() || definition.defaultOwner;
  const editedBy = body.editedBy?.toString().slice(0, 80) ?? null;

  // Upsert current value.
  const { error: upsertErr } = await supabase
    .from("content_slot")
    .upsert(
      {
        id: body.slotId,
        value: trimmed,
        owner,
        status,
        updated_at: new Date().toISOString(),
        updated_by: editedBy,
      },
      { onConflict: "id" }
    );

  if (upsertErr) {
    console.error("[save-slot] upsert failed", upsertErr);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }

  // Append to history (best-effort — don't fail the save if history fails).
  await supabase.from("content_slot_history").insert({
    slot_id: body.slotId,
    value: trimmed,
    updated_by: editedBy,
  });

  // Revalidate the page that hosts this slot.
  try {
    revalidatePath(definition.page);
  } catch {
    /* ignore — revalidation failures don't block the save */
  }

  return NextResponse.json({ ok: true, status, owner });
}
