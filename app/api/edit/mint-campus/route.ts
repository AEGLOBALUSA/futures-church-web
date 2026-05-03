import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken } from "@/lib/intake/server";
import { mintCampusEditorSession } from "@/lib/edit/auth";

export const runtime = "nodejs";

// POST /api/edit/mint-campus  body: { token }
// Validates the campus access_token, then sets a 30-day editor cookie scoped
// to that campus. Called from the client after the pastor opens their intake
// link — Next.js 15 only allows cookie writes in route handlers, not server
// components.
export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (typeof body.token !== "string") {
    return NextResponse.json({ error: "missing token" }, { status: 400 });
  }
  const campus = await getCampusByToken(body.token);
  if (!campus) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }
  await mintCampusEditorSession(campus.slug);
  return NextResponse.json({ ok: true, slug: campus.slug });
}
