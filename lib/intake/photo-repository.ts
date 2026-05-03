// Photo repository — pastor's open photo pool, plus admin assignment helpers
// for placing repository photos into structural slots (hero, gallery, pastor, kids).

import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getSignedPhotoUrl } from "./server";
import type { PhotoCategory } from "./sections";

export type RepositoryPhoto = {
  id: string;
  campus_slug: string;
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  category: PhotoCategory;
  notes: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
};

export type RepositoryPhotoWithUrl = RepositoryPhoto & {
  signedUrl: string | null;
  /** True when this photo is currently placed in any structural slot. */
  isAssigned: boolean;
  /** Section keys this photo is currently placed in (e.g. ["hero-photo"]). */
  assignedSectionKeys: string[];
};

const SLOT_SECTION_KEYS = ["hero-photo", "gallery", "pastors", "kids"] as const;
export type SlotSectionKey = (typeof SLOT_SECTION_KEYS)[number];

export function isSlotSectionKey(key: string): key is SlotSectionKey {
  return (SLOT_SECTION_KEYS as readonly string[]).includes(key);
}

// ────────────────────────────────────────────────────────────────────────────
// Pastor-side reads (called from token-auth API or server pages with token check)
// ────────────────────────────────────────────────────────────────────────────

export async function listRepositoryPhotos(
  campusSlug: string,
  options: { category?: PhotoCategory } = {}
): Promise<RepositoryPhotoWithUrl[]> {
  const supabase = createSupabaseServiceClient();
  let q = supabase
    .from("intake_repository_photo")
    .select("*")
    .eq("campus_slug", campusSlug)
    .order("uploaded_at", { ascending: false });
  if (options.category) q = q.eq("category", options.category);
  const { data: photos, error } = await q;
  if (error || !photos) return [];

  // Fetch all slot assignments for this campus to know which photos are in use.
  const { data: assignments } = await supabase
    .from("intake_photo")
    .select("repository_photo_id, section_key")
    .eq("campus_slug", campusSlug)
    .not("repository_photo_id", "is", null);

  const assignedMap: Record<string, string[]> = {};
  for (const a of assignments ?? []) {
    if (!a.repository_photo_id) continue;
    if (!assignedMap[a.repository_photo_id]) assignedMap[a.repository_photo_id] = [];
    assignedMap[a.repository_photo_id].push(a.section_key);
  }

  return Promise.all(
    (photos as RepositoryPhoto[]).map(async (p) => ({
      ...p,
      signedUrl: await getSignedPhotoUrl(p.storage_path, 3600),
      isAssigned: !!assignedMap[p.id]?.length,
      assignedSectionKeys: assignedMap[p.id] ?? [],
    }))
  );
}

export async function getRepositoryPhoto(id: string, campusSlug: string): Promise<RepositoryPhoto | null> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_repository_photo")
    .select("*")
    .eq("id", id)
    .eq("campus_slug", campusSlug)
    .maybeSingle();
  if (error || !data) return null;
  return data as RepositoryPhoto;
}

// ────────────────────────────────────────────────────────────────────────────
// Pastor-side writes
// ────────────────────────────────────────────────────────────────────────────

export type CreateRepoPhotoInput = {
  campusSlug: string;
  storagePath: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  caption?: string;
  category?: PhotoCategory;
  notes?: string;
  uploadedBy?: string;
};

export async function createRepositoryPhoto(input: CreateRepoPhotoInput): Promise<RepositoryPhoto | null> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_repository_photo")
    .insert({
      campus_slug: input.campusSlug,
      storage_path: input.storagePath,
      file_name: input.fileName ?? null,
      mime_type: input.mimeType ?? null,
      size_bytes: input.sizeBytes ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      caption: input.caption ?? null,
      category: input.category ?? "other",
      notes: input.notes ?? null,
      uploaded_by: input.uploadedBy ?? null,
    })
    .select("*")
    .single();
  if (error || !data) return null;
  return data as RepositoryPhoto;
}

export type UpdateRepoPhotoInput = {
  caption?: string | null;
  category?: PhotoCategory;
  notes?: string | null;
};

export async function updateRepositoryPhoto(
  id: string,
  campusSlug: string,
  patch: UpdateRepoPhotoInput
): Promise<boolean> {
  const supabase = createSupabaseServiceClient();
  const updates: Record<string, unknown> = {};
  if (patch.caption !== undefined) updates.caption = patch.caption;
  if (patch.category !== undefined) updates.category = patch.category;
  if (patch.notes !== undefined) updates.notes = patch.notes;
  if (Object.keys(updates).length === 0) return true;
  const { error } = await supabase
    .from("intake_repository_photo")
    .update(updates)
    .eq("id", id)
    .eq("campus_slug", campusSlug);
  return !error;
}

/**
 * Delete a repository photo. Refuses if the photo is currently assigned to any
 * structural slot — admin must un-assign first to avoid silently breaking the
 * public campus page.
 */
export async function deleteRepositoryPhoto(
  id: string,
  campusSlug: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createSupabaseServiceClient();
  const { data: assignments } = await supabase
    .from("intake_photo")
    .select("section_key")
    .eq("repository_photo_id", id)
    .eq("campus_slug", campusSlug);
  if (assignments && assignments.length > 0) {
    return {
      ok: false,
      error: `Photo is currently in use (${assignments.map((a) => a.section_key).join(", ")}). Ask the admin to remove it from those slots first.`,
    };
  }
  const { data: photo } = await supabase
    .from("intake_repository_photo")
    .select("storage_path")
    .eq("id", id)
    .eq("campus_slug", campusSlug)
    .maybeSingle();
  if (photo?.storage_path) {
    await supabase.storage.from("intake").remove([photo.storage_path]);
  }
  const { error } = await supabase
    .from("intake_repository_photo")
    .delete()
    .eq("id", id)
    .eq("campus_slug", campusSlug);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ────────────────────────────────────────────────────────────────────────────
// Admin-side: assign repository photo → structural slot
// ────────────────────────────────────────────────────────────────────────────

/**
 * Assign a repository photo to a structural slot.
 * Hero/pastors/kids are single-photo slots — assigning replaces any existing assignment.
 * Gallery is multi-photo — assigning appends (or moves to specified sort order).
 */
export async function assignRepoPhotoToSlot(args: {
  campusSlug: string;
  repositoryPhotoId: string;
  sectionKey: SlotSectionKey;
  caption?: string | null;
  sortOrder?: number;
  actorName?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createSupabaseServiceClient();

  const repoPhoto = await getRepositoryPhoto(args.repositoryPhotoId, args.campusSlug);
  if (!repoPhoto) return { ok: false, error: "repository photo not found" };

  const isMultiSlot = args.sectionKey === "gallery";

  // Single-photo slots: clear existing assignment first (un-assigning, not deleting source).
  if (!isMultiSlot) {
    const { data: existing } = await supabase
      .from("intake_photo")
      .select("id")
      .eq("campus_slug", args.campusSlug)
      .eq("section_key", args.sectionKey);
    if (existing && existing.length > 0) {
      await supabase
        .from("intake_photo")
        .delete()
        .in(
          "id",
          existing.map((e) => e.id)
        );
    }
  } else {
    // Gallery: prevent double-assigning the same source photo (idempotent).
    const { data: dup } = await supabase
      .from("intake_photo")
      .select("id")
      .eq("campus_slug", args.campusSlug)
      .eq("section_key", "gallery")
      .eq("repository_photo_id", args.repositoryPhotoId)
      .maybeSingle();
    if (dup) return { ok: true };
  }

  // Determine sort order if not specified (gallery only — append to end).
  let sortOrder = args.sortOrder ?? 0;
  if (isMultiSlot && args.sortOrder === undefined) {
    const { data: last } = await supabase
      .from("intake_photo")
      .select("sort_order")
      .eq("campus_slug", args.campusSlug)
      .eq("section_key", "gallery")
      .order("sort_order", { ascending: false })
      .limit(1);
    sortOrder = (last?.[0]?.sort_order ?? -1) + 1;
  }

  const { error } = await supabase.from("intake_photo").insert({
    campus_slug: args.campusSlug,
    section_key: args.sectionKey,
    storage_path: repoPhoto.storage_path,
    file_name: repoPhoto.file_name,
    mime_type: repoPhoto.mime_type,
    size_bytes: repoPhoto.size_bytes,
    caption: args.caption ?? repoPhoto.caption,
    sort_order: sortOrder,
    uploaded_by: args.actorName ?? "admin",
    repository_photo_id: args.repositoryPhotoId,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Remove a structural-slot assignment (the repo photo stays in the pool). */
export async function unassignSlotPhoto(args: {
  campusSlug: string;
  intakePhotoId: string;
}): Promise<boolean> {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from("intake_photo")
    .delete()
    .eq("id", args.intakePhotoId)
    .eq("campus_slug", args.campusSlug);
  return !error;
}

/** All current slot assignments for a campus, with signed URLs. */
export async function getSlotAssignments(campusSlug: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("intake_photo")
    .select("*")
    .eq("campus_slug", campusSlug)
    .in("section_key", SLOT_SECTION_KEYS as unknown as string[])
    .order("section_key")
    .order("sort_order");
  if (error || !data) return [];
  return Promise.all(
    data.map(async (row) => ({
      ...row,
      signedUrl: await getSignedPhotoUrl(row.storage_path, 3600),
    }))
  );
}

/** Reorder gallery — pass the desired list of intake_photo ids in order. */
export async function reorderGallery(
  campusSlug: string,
  orderedIds: string[]
): Promise<boolean> {
  const supabase = createSupabaseServiceClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("intake_photo")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("campus_slug", campusSlug)
        .eq("section_key", "gallery")
    )
  );
  return true;
}

export function repoPhotoStoragePath(
  campusSlug: string,
  fileName: string
): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = safeName.includes(".") ? safeName.split(".").pop() : "jpg";
  const stem = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `repository/${campusSlug}/${stem}.${ext}`;
}
