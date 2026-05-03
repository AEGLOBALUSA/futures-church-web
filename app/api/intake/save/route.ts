import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken, saveResponse, markStartedIfNeeded } from "@/lib/intake/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: {
    token?: string;
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

  if (!body.token || !body.sectionKey || !body.fieldKey) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const campus = await getCampusByToken(body.token);
  if (!campus) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  await markStartedIfNeeded(campus.slug);

  const result = await saveResponse({
    campusSlug: campus.slug,
    sectionKey: body.sectionKey,
    fieldKey: body.fieldKey,
    value: body.value ?? null,
    editedBy: body.editedBy ?? null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, lastEditedAt: result.lastEditedAt });
}
