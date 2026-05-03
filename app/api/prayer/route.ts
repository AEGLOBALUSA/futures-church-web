import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkAndIncrement, clientIpFrom } from "@/lib/rate-limit";

const PrayerSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().optional(),
  request: z.string().min(1).max(2000),
  campus_slug: z.string().max(100).optional(),
  anonymous: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  // Rate limit — 5/hour per IP. Generous enough for someone praying through
  // multiple distinct concerns; tight enough to stop spam.
  const ip = clientIpFrom(req.headers);
  const rl = await checkAndIncrement({
    key: `prayer:${ip}`,
    limit: 5,
    windowSeconds: 3600,
  });
  if (!rl.allowed) {
    return NextResponse.json({ error: "rate-limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PrayerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  if (!isSupabaseConfigured()) {
    console.log("[prayer] queued (no Supabase config):", parsed.data.campus_slug);
    return NextResponse.json({ ok: true, queued: true });
  }

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("prayer_requests").insert(parsed.data);

  if (error) {
    console.error("[prayer] Supabase error:", error.message);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
