import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { computeProgressPct, intakeSections } from "./sections";

export type IntakeCampus = {
  slug: string;
  display_name: string;
  region: string;
  language: string;
  access_token: string;
  primary_pastor_email: string | null;
  primary_pastor_name: string | null;
  status: "invited" | "started" | "submitted" | "published";
  progress_pct: number;
  invited_at: string | null;
  last_activity_at: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type IntakeResponse = {
  section_key: string;
  field_key: string;
  value: unknown;
  last_edited_by: string | null;
  last_edited_at: string;
};

export type IntakePhoto = {
  id: string;
  campus_slug: string;
  section_key: string;
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  caption: string | null;
  sort_order: number;
  uploaded_by: string | null;
  uploaded_at: string;
};

export type IntakeComment = {
  id: string;
  section_key: string;
  author_name: string | null;
  body: string;
  created_at: string;
};

export async function getCampusByToken(token: string): Promise<IntakeCampus | null> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_campus")
    .select("*")
    .eq("access_token", token)
    .maybeSingle();
  if (error) {
    console.error("getCampusByToken", error);
    return null;
  }
  return data as IntakeCampus | null;
}

export async function getCampusBySlug(slug: string): Promise<IntakeCampus | null> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_campus")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("getCampusBySlug", error);
    return null;
  }
  return data as IntakeCampus | null;
}

export async function getResponses(slug: string): Promise<IntakeResponse[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_response")
    .select("section_key, field_key, value, last_edited_by, last_edited_at")
    .eq("campus_slug", slug);
  if (error) {
    console.error("getResponses", error);
    return [];
  }
  return (data ?? []) as IntakeResponse[];
}

export async function getPhotos(slug: string): Promise<IntakePhoto[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_photo")
    .select("*")
    .eq("campus_slug", slug)
    .order("section_key")
    .order("sort_order");
  if (error) {
    console.error("getPhotos", error);
    return [];
  }
  return (data ?? []) as IntakePhoto[];
}

export async function getComments(slug: string): Promise<IntakeComment[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_comment")
    .select("id, section_key, author_name, body, created_at")
    .eq("campus_slug", slug)
    .order("created_at");
  if (error) {
    console.error("getComments", error);
    return [];
  }
  return (data ?? []) as IntakeComment[];
}

export async function saveResponse(args: {
  campusSlug: string;
  sectionKey: string;
  fieldKey: string;
  value: unknown;
  editedBy?: string | null;
}): Promise<{ ok: true; lastEditedAt: string } | { ok: false; error: string }> {
  const supabase = createSupabaseServiceClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("intake_response").upsert(
    {
      campus_slug: args.campusSlug,
      section_key: args.sectionKey,
      field_key: args.fieldKey,
      value: args.value as never,
      last_edited_by: args.editedBy ?? null,
      last_edited_at: now,
    },
    { onConflict: "campus_slug,section_key,field_key" }
  );
  if (error) return { ok: false, error: error.message };
  await touchCampusActivity(args.campusSlug);
  await logActivity({
    campusSlug: args.campusSlug,
    eventType: "field_saved",
    description: `${args.sectionKey} → ${args.fieldKey}`,
    actorName: args.editedBy ?? null,
  });
  await recomputeProgress(args.campusSlug);
  return { ok: true, lastEditedAt: now };
}

export async function addPhoto(args: {
  campusSlug: string;
  sectionKey: string;
  storagePath: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  caption?: string;
  uploadedBy?: string | null;
}): Promise<{ ok: true; photo: IntakePhoto } | { ok: false; error: string }> {
  const supabase = createSupabaseServiceClient();
  const { data: existing } = await supabase
    .from("intake_photo")
    .select("sort_order")
    .eq("campus_slug", args.campusSlug)
    .eq("section_key", args.sectionKey)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("intake_photo")
    .insert({
      campus_slug: args.campusSlug,
      section_key: args.sectionKey,
      storage_path: args.storagePath,
      file_name: args.fileName ?? null,
      mime_type: args.mimeType ?? null,
      size_bytes: args.sizeBytes ?? null,
      caption: args.caption ?? null,
      sort_order: nextOrder,
      uploaded_by: args.uploadedBy ?? null,
    })
    .select("*")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "insert failed" };

  await touchCampusActivity(args.campusSlug);
  await logActivity({
    campusSlug: args.campusSlug,
    eventType: "photo_uploaded",
    description: `${args.sectionKey} — ${args.fileName ?? "photo"}`,
    actorName: args.uploadedBy ?? null,
  });
  await recomputeProgress(args.campusSlug);
  return { ok: true, photo: data as IntakePhoto };
}

export async function deletePhoto(photoId: string, campusSlug: string): Promise<boolean> {
  const supabase = createSupabaseServiceClient();
  const { data: photo } = await supabase
    .from("intake_photo")
    .select("storage_path")
    .eq("id", photoId)
    .eq("campus_slug", campusSlug)
    .maybeSingle();
  if (photo?.storage_path) {
    await supabase.storage.from("intake").remove([photo.storage_path]);
  }
  const { error } = await supabase
    .from("intake_photo")
    .delete()
    .eq("id", photoId)
    .eq("campus_slug", campusSlug);
  if (error) return false;
  await touchCampusActivity(campusSlug);
  await recomputeProgress(campusSlug);
  return true;
}

export async function addComment(args: {
  campusSlug: string;
  sectionKey: string;
  authorName: string | null;
  body: string;
}): Promise<{ ok: true; comment: IntakeComment } | { ok: false; error: string }> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_comment")
    .insert({
      campus_slug: args.campusSlug,
      section_key: args.sectionKey,
      author_name: args.authorName,
      body: args.body,
    })
    .select("id, section_key, author_name, body, created_at")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "insert failed" };
  await touchCampusActivity(args.campusSlug);
  await logActivity({
    campusSlug: args.campusSlug,
    eventType: "comment_added",
    description: `${args.sectionKey}`,
    actorName: args.authorName,
  });
  return { ok: true, comment: data as IntakeComment };
}

export async function logActivity(args: {
  campusSlug: string | null;
  eventType: string;
  description: string;
  actorName?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createSupabaseServiceClient();
  await supabase.from("intake_activity").insert({
    campus_slug: args.campusSlug,
    event_type: args.eventType,
    description: args.description,
    actor_name: args.actorName ?? null,
    metadata: args.metadata ?? null,
  });
}

export async function touchCampusActivity(slug: string) {
  const supabase = createSupabaseServiceClient();
  const now = new Date().toISOString();
  await supabase
    .from("intake_campus")
    .update({ last_activity_at: now, updated_at: now })
    .eq("slug", slug);
}

export async function markStartedIfNeeded(slug: string) {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from("intake_campus")
    .select("status")
    .eq("slug", slug)
    .maybeSingle();
  if (data && data.status === "invited") {
    await supabase
      .from("intake_campus")
      .update({ status: "started" })
      .eq("slug", slug);
    await logActivity({
      campusSlug: slug,
      eventType: "opened",
      description: "Campus opened the intake form for the first time",
    });
  }
}

export async function recomputeProgress(slug: string) {
  const responses = await getResponses(slug);
  const photos = await getPhotos(slug);

  const responseMap: Record<string, Record<string, unknown>> = {};
  for (const r of responses) {
    if (!responseMap[r.section_key]) responseMap[r.section_key] = {};
    responseMap[r.section_key][r.field_key] = r.value;
  }
  // The "photos" section uses repository photos (admin curates structural slots).
  // Count repo photos so progress reflects what pastors have actually contributed.
  const photoCounts: Record<string, number> = {};
  const supabaseForCount = createSupabaseServiceClient();
  const { count: repoCount } = await supabaseForCount
    .from("intake_repository_photo")
    .select("id", { count: "exact", head: true })
    .eq("campus_slug", slug);
  for (const section of intakeSections) {
    for (const field of section.fields) {
      if (field.type === "photo-repository") {
        photoCounts[`${section.key}:${field.key}`] = repoCount ?? 0;
      }
    }
  }
  // photos var is the legacy intake_photo rows (admin assignments). Suppress unused.
  void photos;
  const pct = computeProgressPct(responseMap, photoCounts);
  const supabase = createSupabaseServiceClient();
  await supabase
    .from("intake_campus")
    .update({ progress_pct: pct, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  return pct;
}

export async function getSignedPhotoUrl(storagePath: string, expiresInSec = 3600): Promise<string | null> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.storage
    .from("intake")
    .createSignedUrl(storagePath, expiresInSec);
  if (error || !data) return null;
  return data.signedUrl;
}

export async function listAllCampusesWithProgress(): Promise<IntakeCampus[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_campus")
    .select("*")
    .order("region")
    .order("display_name");
  if (error) {
    console.error("listAllCampuses", error);
    return [];
  }
  return (data ?? []) as IntakeCampus[];
}

export async function getRecentActivity(limit = 50) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}
