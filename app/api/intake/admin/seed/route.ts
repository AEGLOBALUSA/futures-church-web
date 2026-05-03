import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { campuses as siteCampuses } from "@/lib/content/campuses";
import { generateAccessToken } from "@/lib/intake/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/intake/server";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();

  // Pull existing intake_campus rows so we don't regenerate tokens.
  const { data: existing } = await supabase.from("intake_campus").select("slug");
  const existingSlugs = new Set((existing ?? []).map((r) => r.slug));

  const inserts: Array<{
    slug: string;
    display_name: string;
    region: string;
    language: string;
    access_token: string;
    invited_at: string;
  }> = [];
  const now = new Date().toISOString();

  for (const c of siteCampuses) {
    if (existingSlugs.has(c.slug)) continue;
    const language = c.spanish ? "es" : c.region === "indonesia" ? "id" : "en";
    inserts.push({
      slug: c.slug,
      display_name: c.name,
      region: c.region,
      language,
      access_token: generateAccessToken(),
      invited_at: now,
    });
  }

  if (inserts.length > 0) {
    const { error } = await supabase.from("intake_campus").insert(inserts);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    for (const row of inserts) {
      await logActivity({
        campusSlug: row.slug,
        eventType: "invited",
        description: `Intake row created for ${row.display_name}`,
        actorName: "admin",
      });
    }
  }

  const { data: all } = await supabase
    .from("intake_campus")
    .select("slug, display_name, region, language, access_token, status, progress_pct")
    .order("region")
    .order("display_name");

  return NextResponse.json({
    ok: true,
    inserted: inserts.length,
    total: all?.length ?? 0,
    campuses: all ?? [],
  });
}
