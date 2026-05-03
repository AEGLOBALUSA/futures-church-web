import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken } from "@/lib/intake/server";
import {
  updateRepositoryPhoto,
  deleteRepositoryPhoto,
} from "@/lib/intake/photo-repository";
import { PHOTO_CATEGORIES, type PhotoCategory } from "@/lib/intake/sections";

export const runtime = "nodejs";

const VALID_CATEGORIES = PHOTO_CATEGORIES.map((c) => c.value);

async function authOrFail(token: unknown) {
  if (typeof token !== "string") return { error: "missing token", status: 400 as const };
  const campus = await getCampusByToken(token);
  if (!campus) return { error: "invalid token", status: 401 as const };
  return { campus };
}

// PATCH /api/intake/photos/[id] — pastor updates caption / category / notes.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const auth = await authOrFail(body.token);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const patch: { caption?: string | null; category?: PhotoCategory; notes?: string | null } = {};
  if (body.caption === null || typeof body.caption === "string") {
    patch.caption = body.caption === null ? null : (body.caption as string).slice(0, 240);
  }
  if (typeof body.category === "string" && VALID_CATEGORIES.includes(body.category as PhotoCategory)) {
    patch.category = body.category as PhotoCategory;
  }
  if (body.notes === null || typeof body.notes === "string") {
    patch.notes = body.notes === null ? null : (body.notes as string).slice(0, 500);
  }

  const ok = await updateRepositoryPhoto(id, auth.campus.slug, patch);
  if (!ok) return NextResponse.json({ error: "update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/intake/photos/[id] — pastor removes a photo from the repository.
// Refuses if the photo is currently assigned to a structural slot.
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    /* DELETE may have no body; auth via query string fallback */
  }
  let token: unknown = body.token;
  if (typeof token !== "string") {
    token = req.nextUrl.searchParams.get("token");
  }
  const auth = await authOrFail(token);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const result = await deleteRepositoryPhoto(id, auth.campus.slug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
