import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken, addComment, markStartedIfNeeded } from "@/lib/intake/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { token?: string; sectionKey?: string; body?: string; authorName?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.token || !body.sectionKey || !body.body?.trim()) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const campus = await getCampusByToken(body.token);
  if (!campus) return NextResponse.json({ error: "invalid token" }, { status: 401 });

  await markStartedIfNeeded(campus.slug);

  const result = await addComment({
    campusSlug: campus.slug,
    sectionKey: body.sectionKey,
    authorName: body.authorName ?? null,
    body: body.body.trim().slice(0, 2000),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true, comment: result.comment });
}
