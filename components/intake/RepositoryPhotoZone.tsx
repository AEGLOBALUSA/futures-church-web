"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Trash2, ImagePlus } from "lucide-react";
import { PHOTO_CATEGORIES, type PhotoCategory } from "@/lib/intake/sections";

export type RepositoryPhotoTile = {
  id: string;
  signedUrl: string | null;
  file_name: string | null;
  caption: string | null;
  category: PhotoCategory;
  notes: string | null;
  isAssigned: boolean;
  assignedSectionKeys: string[];
};

export function RepositoryPhotoZone({
  campusSlug,
  token,
  editorName,
  initialPhotos,
  minPhotos,
  onCountChange,
}: {
  campusSlug: string;
  token: string;
  editorName: string;
  initialPhotos: RepositoryPhotoTile[];
  minPhotos?: number;
  onCountChange?: (count: number) => void;
}) {
  const [photos, setPhotos] = useState<RepositoryPhotoTile[]>(initialPhotos);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onCountChange?.(photos.length);
  }, [photos.length, onCountChange]);

  // suppress unused warning — campusSlug is reserved for per-campus URL routing if added later
  void campusSlug;

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    setProgress({ done: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.append("token", token);
      fd.append("file", file);
      fd.append("category", "other");
      if (editorName) fd.append("editedBy", editorName);
      try {
        const res = await fetch("/api/intake/photos", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "upload failed");
          break;
        }
        setPhotos((prev) => [
          {
            id: json.photo.id,
            signedUrl: json.photo.signedUrl,
            file_name: json.photo.file_name,
            caption: json.photo.caption,
            category: json.photo.category,
            notes: json.photo.notes,
            isAssigned: false,
            assignedSectionKeys: [],
          },
          ...prev,
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "upload failed");
        break;
      }
      setProgress({ done: i + 1, total: files.length });
    }

    setBusy(false);
    setProgress(null);
  }

  async function patchPhoto(id: string, patch: Partial<Pick<RepositoryPhotoTile, "caption" | "category" | "notes">>) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    await fetch(`/api/intake/photos/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, ...patch }),
    });
  }

  async function deletePhoto(id: string) {
    const res = await fetch(`/api/intake/photos/${id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "could not delete");
    }
  }

  const visible = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const counts: Record<PhotoCategory | "all", number> = {
    all: photos.length,
    people: photos.filter((p) => p.category === "people").length,
    kids: photos.filter((p) => p.category === "kids").length,
    venue: photos.filter((p) => p.category === "venue").length,
    worship: photos.filter((p) => p.category === "worship").length,
    event: photos.filter((p) => p.category === "event").length,
    pastors: photos.filter((p) => p.category === "pastors").length,
    other: photos.filter((p) => p.category === "other").length,
  };

  const meetsMin = !minPhotos || photos.length >= minPhotos;

  return (
    <div>
      {/* Drop zone — always visible at the top */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer?.files) uploadFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOver
            ? "border-accent bg-accent-muted"
            : "border-ink-900/15 bg-cream-50/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) uploadFiles(e.target.files);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
        <ImagePlus className="mx-auto size-7 text-ink-500" strokeWidth={1.4} />
        <p className="mt-3 font-display text-body-lg italic text-ink-700">
          {busy && progress
            ? `Uploading ${progress.done} of ${progress.total}…`
            : "Drop photos here or tap to choose"}
        </p>
        <p className="mt-1 font-sans text-body-sm text-ink-500">
          Pick as many as you want — phone camera roll, desktop folder, anything. Up to 30MB each.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700 disabled:opacity-40"
          disabled={busy}
        >
          {busy ? "Uploading…" : "Choose photos"}
        </button>
        {minPhotos && (
          <p className="mt-3 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">
            {photos.length} of {minPhotos} minimum {meetsMin && "✓"}
          </p>
        )}
        {error && (
          <p className="mt-3 font-sans text-body-sm text-red-700">{error}</p>
        )}
      </div>

      {/* Category filter chips */}
      {photos.length > 0 && (
        <div className="mt-7 flex flex-wrap gap-2">
          <FilterChip
            current={filter}
            value="all"
            label="All"
            count={counts.all}
            onClick={() => setFilter("all")}
          />
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
      )}

      {/* Tile grid */}
      {visible.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((p) => (
            <Tile key={p.id} photo={p} onPatch={patchPhoto} onDelete={deletePhoto} />
          ))}
        </ul>
      )}
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

function Tile({
  photo,
  onPatch,
  onDelete,
}: {
  photo: RepositoryPhotoTile;
  onPatch: (
    id: string,
    patch: Partial<Pick<RepositoryPhotoTile, "caption" | "category" | "notes">>
  ) => void;
  onDelete: (id: string) => void;
}) {
  const [caption, setCaption] = useState(photo.caption ?? "");
  const [notes, setNotes] = useState(photo.notes ?? "");
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="group relative overflow-hidden rounded-2xl border border-ink-900/10 bg-cream/95">
      <div className="relative aspect-square">
        {photo.signedUrl ? (
          <Image
            src={photo.signedUrl}
            alt={photo.caption ?? photo.file_name ?? "photo"}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center font-ui text-body-sm text-ink-500">…</div>
        )}
        {photo.isAssigned && (
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-emerald-700/90 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.22em] text-cream backdrop-blur">
              In use
            </span>
          </div>
        )}
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={photo.isAssigned}
            title={photo.isAssigned ? "Currently in use — admin must remove from slot first" : "Delete"}
            className="absolute right-2 top-2 rounded-full bg-ink-900/60 p-1.5 text-cream opacity-0 backdrop-blur transition disabled:opacity-30 group-hover:opacity-100 focus:opacity-100 disabled:cursor-not-allowed"
          >
            <Trash2 className="size-3.5" />
          </button>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-900/85 px-3 text-center backdrop-blur">
            <p className="font-display italic text-cream" style={{ fontSize: 13, lineHeight: 1.3 }}>
              Delete this photo?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onDelete(photo.id)}
                className="rounded-full bg-red-700 px-3 py-1 font-ui text-[10px] uppercase tracking-[0.22em] text-cream"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full border border-cream/30 px-3 py-1 font-ui text-[10px] uppercase tracking-[0.22em] text-cream"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2 px-3 py-3">
        <select
          value={photo.category}
          onChange={(e) => onPatch(photo.id, { category: e.target.value as PhotoCategory })}
          className="w-full rounded-lg border border-ink-900/10 bg-cream-50 px-2 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-900 focus:border-accent focus:outline-none"
        >
          {PHOTO_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={() => {
            if (caption !== (photo.caption ?? "")) {
              onPatch(photo.id, { caption: caption || null });
            }
          }}
          placeholder="Caption (optional)"
          maxLength={240}
          className="w-full bg-transparent font-sans text-body-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (photo.notes ?? "")) {
              onPatch(photo.id, { notes: notes || null });
            }
          }}
          placeholder="Notes for the design team (optional)"
          maxLength={500}
          className="w-full bg-transparent font-sans text-body-sm italic text-ink-600 placeholder:text-ink-400 focus:outline-none"
        />
      </div>
    </li>
  );
}
