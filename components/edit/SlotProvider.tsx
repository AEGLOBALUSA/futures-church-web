"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SlotRecord } from "@/lib/content/slots/server";

/**
 * SlotProvider — supplies hot-loaded slot values to every SlotEditor in
 * the tree below it. One instance per page that hosts slots; values come
 * from the server component via `getSlotsForPage(path)`.
 *
 * The shape stays as a plain array (serializable across the server/client
 * boundary) and is converted to a Map on the client for O(1) lookups.
 */

type SlotMap = Map<string, SlotRecord>;

const SlotCtx = createContext<SlotMap | null>(null);

export function SlotProvider({
  initialValues,
  children,
}: {
  initialValues: SlotRecord[];
  children: ReactNode;
}) {
  const map = useMemo(() => new Map(initialValues.map((r) => [r.id, r])), [initialValues]);
  return <SlotCtx.Provider value={map}>{children}</SlotCtx.Provider>;
}

/** Returns the slot record for a given id, or null if not provided. */
export function useSlot(id: string): SlotRecord | null {
  const ctx = useContext(SlotCtx);
  if (!ctx) return null;
  return ctx.get(id) ?? null;
}
