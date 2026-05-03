// Durable persistence for messages from public-facing forms
// (contact, plan-a-visit, capture, etc.). Writes to inbox_messages.
// Failures are non-fatal — the calling API still returns 200 to the visitor
// because we don't want a database hiccup to look like a form failure.

import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type InboxRecord = {
  source: "contact" | "visit" | "capture" | "prayer" | "newsletter";
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  campusSlug?: string | null;
  team?: string | null;
  urgent?: boolean;
  body: Record<string, unknown>;
};

export async function saveToInbox(record: InboxRecord): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn("[inbox] supabase not configured — message dropped:", record.source);
    return;
  }
  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.from("inbox_messages").insert({
      source: record.source,
      name: record.name ?? null,
      email: record.email ?? null,
      phone: record.phone ?? null,
      campus_slug: record.campusSlug ?? null,
      team: record.team ?? null,
      urgent: record.urgent ?? false,
      body: record.body,
    });
    if (error) {
      // Most likely cause: migration 0005 not applied yet. Log loudly,
      // don't throw — the form should still succeed for the visitor.
      console.warn("[inbox] insert failed (apply migration 0005 if not yet):", error.message);
    }
  } catch (err) {
    console.warn("[inbox] unexpected error:", err);
  }
}
