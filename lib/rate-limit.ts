// Lightweight per-key rate limiter, backed by Supabase's rate_limit_counter table.
// Failures are non-fatal — if Supabase is unavailable, we let the request through
// rather than block all traffic on infra hiccup.

import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
  resetAtMs: number;
};

export type RateLimitOptions = {
  /** Identifier for this key (e.g. "chat:1.2.3.4"). Free-form. */
  key: string;
  /** Max requests permitted in the bucket window. */
  limit: number;
  /** Bucket window in seconds (60 = per-minute, 3600 = per-hour). */
  windowSeconds: number;
};

function bucketStart(windowSeconds: number, now = Date.now()): { start: Date; resetAtMs: number } {
  const winMs = windowSeconds * 1000;
  const startMs = Math.floor(now / winMs) * winMs;
  return { start: new Date(startMs), resetAtMs: startMs + winMs };
}

export async function checkAndIncrement(opts: RateLimitOptions): Promise<RateLimitResult> {
  const { start, resetAtMs } = bucketStart(opts.windowSeconds);
  const fail = (count = 0): RateLimitResult => ({ allowed: true, count, limit: opts.limit, resetAtMs });
  if (!isSupabaseConfigured()) return fail();

  try {
    const supabase = createSupabaseServiceClient();
    // Read current count for this bucket.
    const { data: existing } = await supabase
      .from("rate_limit_counter")
      .select("count")
      .eq("key", opts.key)
      .eq("bucket", start.toISOString())
      .maybeSingle();
    const currentCount = existing?.count ?? 0;

    if (currentCount >= opts.limit) {
      return { allowed: false, count: currentCount, limit: opts.limit, resetAtMs };
    }

    // Upsert +1.
    const nextCount = currentCount + 1;
    const { error } = await supabase
      .from("rate_limit_counter")
      .upsert(
        { key: opts.key, bucket: start.toISOString(), count: nextCount, updated_at: new Date().toISOString() },
        { onConflict: "key,bucket" }
      );
    if (error) {
      console.warn("[rate-limit] upsert failed (apply migration 0006):", error.message);
      return fail(currentCount);
    }
    return { allowed: true, count: nextCount, limit: opts.limit, resetAtMs };
  } catch (err) {
    console.warn("[rate-limit] error:", err);
    return fail();
  }
}

/** Pull a best-effort client IP from common headers. */
export function clientIpFrom(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
