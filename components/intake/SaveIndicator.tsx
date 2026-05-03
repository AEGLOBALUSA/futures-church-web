"use client";

import { useEffect, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function SaveIndicator({ status, savedAt, error }: { status: SaveStatus; savedAt?: string | null; error?: string | null }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!savedAt) return;
    const i = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(i);
  }, [savedAt]);

  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">
        <span className="size-1.5 rounded-full bg-accent animate-pulse-dot" />
        saving…
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-red-700">
        <span className="size-1.5 rounded-full bg-red-700" />
        {error ?? "save failed"}
      </span>
    );
  }
  if (status === "saved" && savedAt) {
    return (
      <span className="inline-flex items-center gap-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">
        <span className="size-1.5 rounded-full bg-emerald-700" />
        saved {relativeTime(savedAt, tick)}
      </span>
    );
  }
  return null;
}

function relativeTime(iso: string, _tick: number): string {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  if (diff < 5000) return "just now";
  if (diff < 60_000) return `${Math.round(diff / 1000)}s ago`;
  if (diff < 3600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.round(diff / 3600_000)}h ago`;
  return new Date(iso).toLocaleDateString();
}
