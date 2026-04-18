import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

const NewsletterSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  source: z.string().max(100),
  interests: z.array(z.string().max(50)).optional(),
  consent: z.boolean().refine((v) => v === true, { message: "Consent required" }),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = NewsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { email, name, phone, source, interests, consent } = parsed.data;

  if (!isSupabaseConfigured()) {
    console.log("[newsletter] queued (no Supabase config):", { email, source });
    return NextResponse.json({ ok: true, queued: true });
  }

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("subscribers").upsert(
    {
      email,
      name,
      phone,
      source,
      interests: interests ?? [],
      consent,
      last_touch: new Date().toISOString(),
    },
    { onConflict: "email" }
  );

  if (error) {
    console.error("[newsletter] Supabase error:", error.message);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
