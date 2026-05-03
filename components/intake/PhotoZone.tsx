"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export type PhotoItem = {
  id: string;
  storage_path: string;
  signedUrl: string | null;
  caption: string | null;
  file_name: string | null;
  sort_order: number;
};

export function PhotoZone({
  photos,
  sectionKey,
  token,
  editorName,
  multi,
  minPhotos,
  maxPhotos,
  onAdd,
  onRemove,
  onCaption,
}: {
  photos: PhotoItem[];
  sectionKey: string;
  token: string;
  editorName: string;
  multi: boolean;
  minPhotos?: number;
  maxPhotos?: number;
  onAdd: (photo: PhotoItem) => void;
  onRemove: (photoId: string) => void;
  onCaption: (photoId: string, caption: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const atMax = !multi ? photos.length >= 1 : maxPhotos != null && photos.length >= maxPhotos;

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files);
    if (list.length === 0) return;
    setBusy(true);
    try {
      for (const file of list) {
        if (!multi && photos.length >= 1) break;
        if (multi && maxPhotos != null && photos.length >= maxPhotos) break;
        const fd = new FormData();
        fd.append("token", token);
        fd.append("sectionKey", sectionKey);
        fd.append("editedBy", editorName);
        fd.append("file", file);
        const res = await fetch("/api/intake/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "upload failed");
          break;
        }
        onAdd({
          id: json.photo.id,
          storage_path: json.photo.storage_path,
          signedUrl: json.signedUrl,
          caption: json.photo.caption,
          file_name: json.photo.file_name,
          sort_order: json.photo.sort_order,
        });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {photos.length > 0 && (
        <ul className={`grid gap-3 ${multi ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
          {photos.map((p) => (
            <li key={p.id} className="group relative overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-50">
              <div className="relative aspect-[4/5] w-full bg-cream-300">
                {p.signedUrl ? (
                  <Image src={p.signedUrl} alt={p.caption ?? p.file_name ?? "photo"} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center font-ui text-body-sm text-ink-500">…</div>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="absolute right-2 top-2 rounded-full bg-ink-900/60 px-2.5 py-1 font-ui text-[10px] uppercase tracking-[0.18em] text-cream opacity-0 backdrop-blur transition group-hover:opacity-100 focus:opacity-100"
                  aria-label="Remove photo"
                >
                  Remove
                </button>
              </div>
              {multi && (
                <input
                  type="text"
                  defaultValue={p.caption ?? ""}
                  onBlur={(e) => {
                    if (e.target.value !== (p.caption ?? "")) onCaption(p.id, e.target.value);
                  }}
                  placeholder="Caption (optional)"
                  className="w-full border-t border-ink-900/10 bg-transparent px-3 py-2 font-sans text-body-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {!atMax && (
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
          className={`mt-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragOver ? "border-accent bg-accent-muted" : "border-ink-900/15 bg-cream-50/60"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multi}
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) uploadFiles(e.target.files);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
          <p className="font-display text-body-lg italic text-ink-700">
            {busy ? "Uploading…" : multi ? "Drop photos here" : "Drop a photo here"}
          </p>
          <p className="mt-1 font-sans text-body-sm text-ink-500">
            or{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-accent underline underline-offset-4"
              disabled={busy}
            >
              choose from your device
            </button>
            . JPG / PNG / HEIC up to 30MB.
          </p>
          {multi && minPhotos && photos.length < minPhotos && (
            <p className="mt-3 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">
              {photos.length} of {minPhotos} minimum
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 font-sans text-body-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
