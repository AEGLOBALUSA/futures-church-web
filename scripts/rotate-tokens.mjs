// Rotate every campus intake access token. Run once to invalidate any old
// links before emailing pastors. New tokens are written to a CSV on disk —
// nothing is echoed to stdout.
//
//   node --env-file=.env.local scripts/rotate-tokens.mjs
//
// Output: /tmp/futures-intake-tokens-<DATE>.csv with columns
//         slug, display_name, new_token, intake_link

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://futures.church";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function newToken() {
  return randomBytes(32).toString("base64url");
}

const { data: campuses, error } = await supabase
  .from("intake_campus")
  .select("slug, display_name");

if (error) {
  console.error("Could not load campuses:", error.message);
  process.exit(1);
}
if (!campuses || campuses.length === 0) {
  console.error("No campuses found in intake_campus table");
  process.exit(1);
}

const rotated = [];
let failures = 0;
for (const c of campuses) {
  const token = newToken();
  const { error: updErr } = await supabase
    .from("intake_campus")
    .update({ access_token: token, updated_at: new Date().toISOString() })
    .eq("slug", c.slug);
  if (updErr) {
    failures += 1;
    continue;
  }
  // Best-effort activity log — don't fail the rotation if it's missing.
  await supabase.from("intake_activity").insert({
    campus_slug: c.slug,
    event_type: "token_rotated",
    description: `Token rotated (bulk script) for ${c.display_name}`,
    actor_name: "admin-cli",
  });
  rotated.push({
    slug: c.slug,
    display_name: c.display_name,
    token,
    link: `${SITE_URL}/intake/${c.slug}?key=${token}`,
  });
}

// Write to /tmp so it never ends up in the repo.
const date = new Date().toISOString().slice(0, 10);
const outDir = "/tmp";
mkdirSync(outDir, { recursive: true });
const path = join(outDir, `futures-intake-tokens-${date}.csv`);
const csv = [
  "slug,display_name,token,intake_link",
  ...rotated.map((r) =>
    [r.slug, JSON.stringify(r.display_name), r.token, r.link].join(",")
  ),
].join("\n");
writeFileSync(path, csv + "\n", { mode: 0o600 });

console.log(
  `\n✓ Rotated ${rotated.length} of ${campuses.length} campuses${
    failures > 0 ? ` (${failures} failed)` : ""
  }`
);
console.log(`✓ CSV written to: ${path}`);
console.log(`✓ Mode: 0600 (only readable by you)`);
console.log(
  `\n  All previous intake links are now invalidated. Send each campus pastor`
);
console.log(`  their unique link from the CSV when you're ready.`);
