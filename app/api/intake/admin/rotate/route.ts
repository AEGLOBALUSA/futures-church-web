import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { generateAccessToken } from "@/lib/intake/auth";
import { logActivity } from "@/lib/intake/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// POST /api/intake/admin/rotate
//   { campusSlug: string }       → rotate one campus's token
//   { all: true }                → rotate every campus's token
// Invalidates the current link. Returns the new token (and link if single).
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { campusSlug?: string; all?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";

  if (body.all) {
    const { data: campuses } = await supabase
      .from("intake_campus")
      .select("slug, display_name");
    if (!campuses) return NextResponse.json({ error: "could not load campuses" }, { status: 500 });

    const updated: Array<{ slug: string; display_name: string; access_token: string; link: string }> = [];
    for (const c of campuses) {
      const newToken = generateAccessToken();
      const { error } = await supabase
        .from("intake_campus")
        .update({ access_token: newToken, updated_at: new Date().toISOString() })
        .eq("slug", c.slug);
      if (error) continue;
      await logActivity({
        campusSlug: c.slug,
        eventType: "token_rotated",
        description: `Token rotated (bulk) for ${c.display_name}`,
        actorName: "admin",
      });
      updated.push({
        slug: c.slug,
        display_name: c.display_name,
        access_token: newToken,
        link: `${baseUrl}/intake/${c.slug}?key=${newToken}`,
      });
    }
    return NextResponse.json({ ok: true, rotated: updated.length, campuses: updated });
  }

  if (!body.campusSlug) {
    return NextResponse.json({ error: "missing campusSlug or all flag" }, { status: 400 });
  }

  const { data: campus } = await supabase
    .from("intake_campus")
    .select("slug, display_name")
    .eq("slug", body.campusSlug)
    .maybeSingle();
  if (!campus) return NextResponse.json({ error: "campus not found" }, { status: 404 });

  const newToken = generateAccessToken();
  const { error } = await supabase
    .from("intake_campus")
    .update({ access_token: newToken, updated_at: new Date().toISOString() })
    .eq("slug", body.campusSlug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({
    campusSlug: body.campusSlug,
    eventType: "token_rotated",
    description: `Token rotated for ${campus.display_name}`,
    actorName: "admin",
  });

  return NextResponse.json({
    ok: true,
    slug: campus.slug,
    access_token: newToken,
    link: `${baseUrl}/intake/${campus.slug}?key=${newToken}`,
  });
}
