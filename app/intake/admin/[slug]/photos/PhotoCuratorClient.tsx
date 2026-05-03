"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X, Image as ImageIcon, ArrowDown, ArrowUp } from "lucide-react";
import { PHOTO_CATEGORIES, type PhotoCategory } from "@/lib/intake/sections";
import type {
  RepositoryPhotoWithUrl,
  SlotSectionKey,
} from "@/lib/intake/photo-repository";

type SlotRow = {
  id: string;
  campus_slug: string;
  section_key: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  signedUrl: string | null;
  repository_photo_id?: string | null;
};

type PoolPhoto = RepositoryPhotoWithUrl;

const SLOT_DEFINITIONS: { key: SlotSectionKey; label: string; multi: boolean; aspect: string }[] = [
  { key: "hero-photo", label: "Campus hero", multi: false, aspect: "aspect-[5/4]" },
  { key: "pastors", label: "Pastor portrait", multi: false, aspect: "aspect-[2/3]" },
  { key: "kids", label: "Kids photo", multi: false, aspect: "aspect-[4/3]" },
  { key: "gallery", label: "Gallery", multi: true, aspect: "aspect-square" },
];

export function PhotoCuratorClient({
  campusSlug,
  initialPool,
  initialSlots,
}: {
  campusSlug: string;
  initialPool: PoolPhoto[];
  initialSlots: SlotRow[];
}) {
  const [pool, setPool] = useState<PoolPhoto[]>(initialPool);
  const [slots, setSlots] = useState<SlotRow[]>(initialSlots);
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");
  const [activePhoto, setActivePhoto] = useState<PoolPhoto | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch(`/api/intake/admin/photos/list?campus=${campusSlug}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      setPool(json.pool ?? []);
      setSlots(json.slots ?? []);
    }
  }

  async function assign(repoPhotoId: string, sectionKey: SlotSectionKey) {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/intake/admin/photos/assign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        campusSlug,
        repositoryPhotoId: repoPhotoId,
        sectionKey,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "assign failed");
      return;
    }
    setActivePhoto(null);
    await refresh();
  }

  async function unassign(intakePhotoId: string) {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/intake/admin/photos/unassign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ campusSlug, intakePhotoId }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "unassign failed");
      return;
    }
    await refresh();
  }

  const slotsByKey = useMemo(() => {
    const map: Record<string, SlotRow[]> = {};
    for (const s of slots) {
      if (!map[s.section_key]) map[s.section_key] = [];
      map[s.section_key].push(s);
    }
    for (const list of Object.values(map)) {
      list.sort((a, b) => a.sort_order - b.sort_order);
    }
    return map;
  }, [slots]);

  const visiblePool = filter === "all" ? pool : pool.filter((p) => p.category === filter);

  const counts: Record<PhotoCategory | "all", number> = {
    all: pool.length,
    people: pool.filter((p) => p.category === "people").length,
    kids: pool.filter((p) => p.category === "kids").length,
    venue: pool.filter((p) => p.category === "venue").length,
    worship: pool.filter((p) => p.category === "worship").length,
    event: pool.filter((p) => p.category === "event").length,
    pastors: pool.filter((p) => p.category === "pastors").length,
    other: pool.filter((p) => p.category === "other").length,
  };

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[7fr_5fr]">
      {/* ── Pool ─────────────────────────────────────────────────────────── */}
      <section>
        <header className="flex items-baseline justify-between">
          <h2 className="font-display text-display-md text-ink-900">
            Pool · {pool.length}
          </h2>
          <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
            Pastor uploads
          </span>
        </header>

        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip current={filter} value="all" label="All" count={counts.all} onClick={() => setFilter("all")} />
          {PHOTO_CATEGORIES.map((c) => (
            <FilterChip
              key={c.value}
              current={filter}
              value={c.value}
              label={c.label}
              count={counts[c.value]}
              onClick={() => setFilter(c.value)}
            />
          ))}
        </div>

        {visiblePool.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-ink-900/15 bg-cream/60 px-7 py-14 text-center">
            <ImageIcon className="mx-auto size-7 text-ink-500" strokeWidth={1.4} />
            <p className="mt-4 font-display italic text-ink-700" style={{ fontSize: 18 }}>
              {pool.length === 0 ? "No photos uploaded yet." : "No photos in this category."}
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visiblePool.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setActivePhoto(p)}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-50 transition hover:border-accent/40"
                >
                  <div className="relative aspect-square">
                    {p.signedUrl ? (
                      <Image
                        src={p.signedUrl}
                        alt={p.caption ?? p.file_name ?? "photo"}
                        fill
                        sizes="33vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : null}
                    {p.isAssigned && (
                      <span className="absolute left-2 top-2 rounded-full bg-emerald-700/90 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.22em] text-cream backdrop-blur">
                        In use · {p.assignedSectionKeys.map((k) => slotShortLabel(k)).join(", ")}
                      </span>
                    )}
                  </div>
                  <div className="px-3 py-2 text-left">
                    <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-accent">
                      {labelForCategory(p.category)}
                    </p>
                    {p.caption && (
                      <p
                        className="mt-1 truncate font-sans text-body-sm text-ink-900"
                        title={p.caption}
                      >
                        {p.caption}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Slots ────────────────────────────────────────────────────────── */}
      <section>
        <header className="flex items-baseline justify-between">
          <h2 className="font-display text-display-md text-ink-900">Slots</h2>
          <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
            What visitors see
          </span>
        </header>

        <div className="mt-6 space-y-6">
          {SLOT_DEFINITIONS.map((slot) => {
            const placed = slotsByKey[slot.key] ?? [];
            return (
              <SlotPanel
                key={slot.key}
                slot={slot}
                placed={placed}
                onUnassign={unassign}
                onReorder={(orderedIds) => reorderGallery(campusSlug, orderedIds, refresh)}
                disabled={busy}
              />
            );
          })}
        </div>

        {error && (
          <p className="mt-4 font-sans text-body-sm text-red-700">{error}</p>
        )}
      </section>

      {/* ── Assign modal ─────────────────────────────────────────────────── */}
      {activePhoto && (
        <AssignModal
          photo={activePhoto}
          onAssign={(sectionKey) => assign(activePhoto.id, sectionKey)}
          onClose={() => setActivePhoto(null)}
          busy={busy}
        />
      )}
    </div>
  );
}

function SlotPanel({
  slot,
  placed,
  onUnassign,
  onReorder,
  disabled,
}: {
  slot: { key: SlotSectionKey; label: string; multi: boolean; aspect: string };
  placed: SlotRow[];
  onUnassign: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  disabled: boolean;
}) {
  function move(idx: number, dir: -1 | 1) {
    const next = [...placed];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onReorder(next.map((p) => p.id));
  }

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-cream/95 px-5 py-5 sm:px-6 sm:py-6">
      <header className="flex items-baseline justify-between">
        <h3 className="font-display italic text-ink-900" style={{ fontSize: 19, fontWeight: 300 }}>
          {slot.label}
        </h3>
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
          {slot.multi ? `${placed.length} placed` : placed.length === 0 ? "Empty" : "Filled"}
        </span>
      </header>

      {placed.length === 0 ? (
        <div className="mt-4 grid place-items-center rounded-2xl border-2 border-dashed border-ink-900/10 bg-cream-50 px-6 py-10 text-center">
          <ImageIcon className="size-6 text-ink-400" strokeWidth={1.4} />
          <p className="mt-2 font-sans text-body-sm text-ink-500">
            Tap a pool photo to place it here.
          </p>
        </div>
      ) : slot.multi ? (
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {placed.map((row, idx) => (
            <li key={row.id} className="group relative overflow-hidden rounded-xl border border-ink-900/10 bg-cream-50">
              <div className={`relative ${slot.aspect}`}>
                {row.signedUrl && (
                  <Image
                    src={row.signedUrl}
                    alt={row.caption ?? "gallery photo"}
                    fill
                    sizes="25vw"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-ink-900/65 p-1.5 backdrop-blur opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0 || disabled}
                    className="rounded-full p-1 text-cream disabled:opacity-30"
                    aria-label="Move earlier"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === placed.length - 1 || disabled}
                    className="rounded-full p-1 text-cream disabled:opacity-30"
                    aria-label="Move later"
                  >
                    <ArrowDown className="size-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onUnassign(row.id)}
                  disabled={disabled}
                  className="rounded-full p-1 text-cream"
                  aria-label="Remove from gallery"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // Single-photo slot
        <div className="mt-4 flex items-stretch gap-3">
          <div className={`relative w-32 shrink-0 overflow-hidden rounded-xl border border-ink-900/10 ${slot.aspect}`}>
            {placed[0].signedUrl && (
              <Image
                src={placed[0].signedUrl}
                alt={placed[0].caption ?? slot.label}
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between">
            {placed[0].caption && (
              <p className="font-sans text-body-sm text-ink-700">{placed[0].caption}</p>
            )}
            <button
              type="button"
              onClick={() => onUnassign(placed[0].id)}
              disabled={disabled}
              className="mt-auto self-start rounded-full border border-ink-900/15 bg-cream/70 px-3 py-1.5 font-ui text-[10px] uppercase tracking-[0.2em] text-ink-700 hover:bg-cream-300"
            >
              Clear slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignModal({
  photo,
  onAssign,
  onClose,
  busy,
}: {
  photo: PoolPhoto;
  onAssign: (sectionKey: SlotSectionKey) => void;
  onClose: () => void;
  busy: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/45 backdrop-blur-sm px-6">
      <div className="w-full max-w-lg rounded-3xl border border-ink-900/10 bg-cream/98 px-7 py-7 shadow-[0_30px_80px_-30px_rgba(20,20,20,0.4)]">
        <header className="flex items-baseline justify-between">
          <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            Place this photo
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-600 hover:bg-cream-300"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="mt-4 overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/10]">
            {photo.signedUrl && (
              <Image
                src={photo.signedUrl}
                alt={photo.caption ?? "photo"}
                fill
                sizes="400px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          {photo.caption && (
            <p className="mt-2 font-display italic text-ink-700" style={{ fontSize: 14 }}>
              {photo.caption}
            </p>
          )}
        </div>
        <p className="mt-5 font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
          Where should this go?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {SLOT_DEFINITIONS.map((slot) => (
            <button
              key={slot.key}
              type="button"
              onClick={() => onAssign(slot.key)}
              disabled={busy}
              className="rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 text-left font-display italic text-ink-900 transition hover:border-accent hover:bg-cream-100 disabled:opacity-40"
              style={{ fontSize: 15, fontWeight: 300 }}
            >
              {slot.label}
              <span className="block font-ui text-[9px] uppercase tracking-[0.2em] text-ink-500">
                {slot.multi ? "add to gallery" : "set / replace"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  current,
  value,
  label,
  count,
  onClick,
}: {
  current: string;
  value: string;
  label: string;
  count: number;
  onClick: () => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition ${
        active
          ? "bg-ink-900 text-cream"
          : "border border-ink-900/15 bg-cream/60 text-ink-700 hover:bg-cream-300"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          active ? "bg-white/15" : "bg-ink-900/8 text-ink-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function labelForCategory(c: PhotoCategory): string {
  return PHOTO_CATEGORIES.find((x) => x.value === c)?.label ?? c;
}

function slotShortLabel(sectionKey: string): string {
  switch (sectionKey) {
    case "hero-photo": return "Hero";
    case "gallery": return "Gallery";
    case "pastors": return "Pastor";
    case "kids": return "Kids";
    default: return sectionKey;
  }
}

async function reorderGallery(campusSlug: string, orderedIds: string[], onDone: () => Promise<void>) {
  await fetch("/api/intake/admin/photos/reorder", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ campusSlug, orderedIds }),
  });
  await onDone();
}
