import { NextRequest, NextResponse } from "next/server";
import { getCampusByToken } from "@/lib/intake/server";
import { getCampusEvents } from "@/lib/events/server";

export const runtime = "nodejs";

// GET /api/intake/events/list?campus=<slug>&token=<token>
// Returns all events (incl. drafts + recent past) for the editor's list view.
export async function GET(req: NextRequest) {
  const campus = req.nextUrl.searchParams.get("campus");
  const token = req.nextUrl.searchParams.get("token");
  if (!campus || !token) {
    return NextResponse.json({ error: "missing campus or token" }, { status: 400 });
  }
  const c = await getCampusByToken(token);
  if (!c || c.slug !== campus) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }
  const events = await getCampusEvents(campus, {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    includeUnpublished: true,
  });
  return NextResponse.json({ events });
}
