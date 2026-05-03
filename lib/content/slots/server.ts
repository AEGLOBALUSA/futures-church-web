/**
 * Server-side helpers for site-wide content slots. Slots are the editable
 * copy blocks on the public site that aren't per-campus — homepage hero,
 * /kids program description, /selah theme, etc.
 *
 * Every slot is registered in `slot-registry.ts` with a default owner
 * (almost always "Josh Greenwood (or appointee)"). The current value
 * lives in Supabase (`content_slot` table) and is hot-loaded on render.
 *
 * Failure mode: if Supabase is unconfigured or the row is missing, the
 * slot returns empty and the page falls back to whatever default copy
 * is hard-coded (or to the empty review-mode placeholder).
 */

import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SLOT_REGISTRY, type SlotDefinition } from "./registry";

export type SlotRecord = {
  id: string;
  value: string;
  owner: string;
  status: "empty" | "draft" | "filled";
  updatedAt: string | null;
  updatedBy: string | null;
};

export type SlotWithDefinition = SlotRecord & {
  definition: SlotDefinition;
};

/** Hot-load a single slot value. Returns null if Supabase is offline. */
export async function getSlot(id: string): Promise<SlotRecord | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from("content_slot")
    .select("id, value, owner, status, updated_at, updated_by")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    value: data.value,
    owner: data.owner,
    status: data.status as SlotRecord["status"],
    updatedAt: data.updated_at,
    updatedBy: data.updated_by,
  };
}

/** Hot-load every slot. Used by the coverage dashboard. */
export async function getAllSlotsWithStatus(): Promise<SlotWithDefinition[]> {
  if (!isSupabaseConfigured()) {
    return SLOT_REGISTRY.map((definition) => ({
      id: definition.id,
      value: "",
      owner: definition.defaultOwner,
      status: "empty" as const,
      updatedAt: null,
      updatedBy: null,
      definition,
    }));
  }
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from("content_slot")
    .select("id, value, owner, status, updated_at, updated_by");
  const records = new Map((data ?? []).map((r) => [r.id as string, r]));
  return SLOT_REGISTRY.map((definition) => {
    const r = records.get(definition.id);
    return {
      id: definition.id,
      value: r?.value ?? "",
      owner: r?.owner ?? definition.defaultOwner,
      status:
        (r?.status as SlotRecord["status"]) ??
        (r?.value && r.value.length > 0 ? "filled" : "empty"),
      updatedAt: r?.updated_at ?? null,
      updatedBy: r?.updated_by ?? null,
      definition,
    };
  });
}

/** Coverage stats — used by the admin dashboard. */
export async function getCoverageStats(): Promise<{
  total: number;
  filled: number;
  draft: number;
  empty: number;
  byOwner: Record<string, { filled: number; total: number }>;
}> {
  const slots = await getAllSlotsWithStatus();
  const total = slots.length;
  let filled = 0;
  let draft = 0;
  let empty = 0;
  const byOwner: Record<string, { filled: number; total: number }> = {};
  for (const s of slots) {
    if (s.status === "filled") filled += 1;
    else if (s.status === "draft") draft += 1;
    else empty += 1;
    if (!byOwner[s.owner]) byOwner[s.owner] = { filled: 0, total: 0 };
    byOwner[s.owner].total += 1;
    if (s.status === "filled") byOwner[s.owner].filled += 1;
  }
  return { total, filled, draft, empty, byOwner };
}
