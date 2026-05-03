// Events data layer. All public reads filter to is_published; all writes go
// through API routes that validate the campus intake token first.
//
// Types + constants live in lib/events/types.ts (importable from client too).
// This file is server-only — it imports next/headers via the supabase server client.

import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSignedPhotoUrl } from "@/lib/intake/server";
import type {
  CampusEvent,
  CampusAnnouncement,
  EventCategory,
  EventWithSignedImage,
} from "./types";

export type {
  CampusEvent,
  CampusAnnouncement,
  EventCategory,
  EventWithSignedImage,
} from "./types";
export { EVENT_CATEGORIES } from "./types";

async function signImage(path: string | null): Promise<string | null> {
  if (!path) return null;
  return getSignedPhotoUrl(path, 3600);
}

async function attachSignedImages(events: CampusEvent[]): Promise<EventWithSignedImage[]> {
  return Promise.all(
    events.map(async (e) => ({ ...e, coverImageUrl: await signImage(e.cover_image_path) }))
  );
}

// ─── Reads ──────────────────────────────────────────────────────────────────

/**
 * All published events for a campus, ordered by start time. Default range: from
 * 1 hour ago to 90 days out. Past events are useful for "what just happened"
 * but most callers want upcoming only.
 */
export async function getCampusEvents(
  slug: string,
  options: { from?: Date; to?: Date; includePast?: boolean; includeUnpublished?: boolean } = {}
): Promise<EventWithSignedImage[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServiceClient();

  const from = options.from ?? (options.includePast ? new Date(0) : new Date(Date.now() - 60 * 60 * 1000));
  const to = options.to ?? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  let q = supabase
    .from("campus_event")
    .select("*")
    .eq("campus_slug", slug)
    .gte("starts_at", from.toISOString())
    .lte("starts_at", to.toISOString())
    .order("starts_at", { ascending: true });

  if (!options.includeUnpublished) q = q.eq("is_published", true);

  const { data, error } = await q;
  if (error) {
    console.error("getCampusEvents", error);
    return [];
  }
  return attachSignedImages((data ?? []) as CampusEvent[]);
}

/**
 * Next service event (category='service') for a campus. Used by the campus
 * page hero "This Sunday" strip and by Milo when asked service times.
 */
export async function getNextServiceEvent(slug: string): Promise<EventWithSignedImage | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("campus_event")
    .select("*")
    .eq("campus_slug", slug)
    .eq("category", "service")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  const [withImg] = await attachSignedImages([data as CampusEvent]);
  return withImg;
}

/** Top featured/upcoming events across all campuses for the home "Coming up" rail. */
export async function getGlobalUpcomingEvents(limit = 8): Promise<EventWithSignedImage[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("campus_event")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("is_featured", { ascending: false })
    .order("starts_at", { ascending: true })
    .limit(limit);
  if (error || !data) return [];
  return attachSignedImages(data as CampusEvent[]);
}

/** Active announcements for a campus — short-form, not full events. */
export async function getCampusAnnouncements(slug: string): Promise<CampusAnnouncement[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServiceClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("campus_announcement")
    .select("*")
    .eq("campus_slug", slug)
    .eq("is_published", true)
    .lte("starts_at", now)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("starts_at", { ascending: false });
  if (error || !data) return [];
  return data as CampusAnnouncement[];
}

/** Pre-formatted block for Milo: "Upcoming at <campus>: ..." */
export async function buildEventsKnowledgeForMilo(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServiceClient();
  const horizon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("campus_event")
    .select("campus_slug, title, category, starts_at, location, description")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .lte("starts_at", horizon)
    .order("campus_slug")
    .order("starts_at");
  if (!data || data.length === 0) return null;

  // Group by campus, max 8 per campus to stay tight in the prompt.
  const byCampus: Record<string, typeof data> = {};
  for (const e of data) {
    if (!byCampus[e.campus_slug]) byCampus[e.campus_slug] = [];
    if (byCampus[e.campus_slug].length < 8) byCampus[e.campus_slug].push(e);
  }
  const sections: string[] = [];
  for (const [slug, list] of Object.entries(byCampus)) {
    const lines = list.map((e) => {
      const when = formatDateTimeShort(e.starts_at);
      const loc = e.location ? ` @ ${e.location}` : "";
      return `- ${when}: ${e.title}${loc}`;
    });
    sections.push(`### ${slug}\n${lines.join("\n")}`);
  }
  return `# UPCOMING EVENTS — next 30 days (use for "what's on this week at X")
${sections.join("\n\n")}`;
}

function formatDateTimeShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ─── Writes (called from API routes after token validation) ─────────────────

export type CreateEventInput = {
  campusSlug: string;
  category: EventCategory;
  title: string;
  description?: string | null;
  startsAt: string;
  endsAt?: string | null;
  allDay?: boolean;
  location?: string | null;
  audience?: string[];
  registrationUrl?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  recurrence?: CampusEvent["recurrence"];
  coverImagePath?: string | null;
  createdBy?: string | null;
};

export async function createEvent(input: CreateEventInput): Promise<{ ok: true; event: CampusEvent } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "supabase not configured" };
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("campus_event")
    .insert({
      campus_slug: input.campusSlug,
      category: input.category,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      starts_at: input.startsAt,
      ends_at: input.endsAt ?? null,
      all_day: input.allDay ?? false,
      location: input.location?.trim() || null,
      audience: input.audience && input.audience.length > 0 ? input.audience : ["everyone"],
      registration_url: input.registrationUrl?.trim() || null,
      is_featured: input.isFeatured ?? false,
      is_published: input.isPublished ?? true,
      recurrence: input.recurrence ?? "none",
      cover_image_path: input.coverImagePath ?? null,
      created_by: input.createdBy ?? null,
      updated_by: input.createdBy ?? null,
    })
    .select("*")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "insert failed" };
  await logEventActivity({
    eventId: data.id,
    campusSlug: input.campusSlug,
    eventType: "created",
    description: `${input.category} · ${input.title}`,
    actorName: input.createdBy ?? null,
  });
  return { ok: true, event: data as CampusEvent };
}

export async function updateEvent(
  id: string,
  campusSlug: string,
  patch: Partial<CreateEventInput> & { updatedBy?: string | null }
): Promise<{ ok: true; event: CampusEvent } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "supabase not configured" };
  const supabase = createSupabaseServiceClient();
  const updates: Record<string, unknown> = {};
  if (patch.category != null) updates.category = patch.category;
  if (patch.title != null) updates.title = patch.title.trim();
  if (patch.description !== undefined) updates.description = patch.description?.trim() || null;
  if (patch.startsAt != null) updates.starts_at = patch.startsAt;
  if (patch.endsAt !== undefined) updates.ends_at = patch.endsAt ?? null;
  if (patch.allDay != null) updates.all_day = patch.allDay;
  if (patch.location !== undefined) updates.location = patch.location?.trim() || null;
  if (patch.audience != null) updates.audience = patch.audience.length > 0 ? patch.audience : ["everyone"];
  if (patch.registrationUrl !== undefined) updates.registration_url = patch.registrationUrl?.trim() || null;
  if (patch.isFeatured != null) updates.is_featured = patch.isFeatured;
  if (patch.isPublished != null) updates.is_published = patch.isPublished;
  if (patch.recurrence != null) updates.recurrence = patch.recurrence;
  if (patch.coverImagePath !== undefined) updates.cover_image_path = patch.coverImagePath ?? null;
  updates.updated_by = patch.updatedBy ?? null;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("campus_event")
    .update(updates)
    .eq("id", id)
    .eq("campus_slug", campusSlug)
    .select("*")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "update failed" };
  await logEventActivity({
    eventId: id,
    campusSlug,
    eventType: "updated",
    description: data.title,
    actorName: patch.updatedBy ?? null,
  });
  return { ok: true, event: data as CampusEvent };
}

export async function deleteEvent(id: string, campusSlug: string, actorName?: string | null): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createSupabaseServiceClient();
  // Get title + image path before delete for activity log + storage cleanup.
  const { data: existing } = await supabase
    .from("campus_event")
    .select("title, cover_image_path")
    .eq("id", id)
    .eq("campus_slug", campusSlug)
    .maybeSingle();

  const { error } = await supabase
    .from("campus_event")
    .delete()
    .eq("id", id)
    .eq("campus_slug", campusSlug);
  if (error) return false;

  if (existing?.cover_image_path) {
    await supabase.storage.from("intake").remove([existing.cover_image_path]);
  }
  await logEventActivity({
    eventId: id,
    campusSlug,
    eventType: "deleted",
    description: existing?.title ?? id,
    actorName: actorName ?? null,
  });
  return true;
}

export async function getEventById(id: string, campusSlug: string): Promise<CampusEvent | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("campus_event")
    .select("*")
    .eq("id", id)
    .eq("campus_slug", campusSlug)
    .maybeSingle();
  if (error || !data) return null;
  return data as CampusEvent;
}

async function logEventActivity(args: {
  eventId: string | null;
  campusSlug: string;
  eventType: string;
  description: string;
  actorName: string | null;
}) {
  const supabase = createSupabaseServiceClient();
  await supabase.from("campus_event_activity").insert({
    event_id: args.eventId,
    campus_slug: args.campusSlug,
    event_type: args.eventType,
    description: args.description,
    actor_name: args.actorName,
  });
}
