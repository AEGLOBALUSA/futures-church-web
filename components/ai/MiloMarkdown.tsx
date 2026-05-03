"use client";

import { Fragment, useMemo, type MouseEvent } from "react";

const SHARE_LOCATION_HREF = "#milo-share-location";
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

type Segment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string };

function parseLinks(text: string): Segment[] {
  const out: Segment[] = [];
  let lastIdx = 0;
  for (const m of text.matchAll(LINK_RE)) {
    if (m.index === undefined) continue;
    if (m.index > lastIdx) {
      out.push({ type: "text", value: text.slice(lastIdx, m.index) });
    }
    out.push({ type: "link", value: m[1], href: m[2] });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) {
    out.push({ type: "text", value: text.slice(lastIdx) });
  }
  return out;
}

/**
 * Minimal Milo-output renderer.
 *
 * Only one piece of markdown is parsed: the `[text](url)` link form. Everything
 * else passes through as plain text (preserving the `whitespace-pre-wrap`
 * paragraph styling Milo expects).
 *
 * The special href `#milo-share-location` is intercepted and rendered as a
 * one-tap pill. When clicked, `onShareLocation()` fires — the parent surface
 * is responsible for triggering the geolocation flow and re-sending the user's
 * last message with coordinates attached.
 *
 * All other links render as ordinary anchors.
 */
export function MiloMarkdown({
  text,
  onShareLocation,
}: {
  text: string;
  onShareLocation?: () => void;
}) {
  const segments = useMemo(() => parseLinks(text), [text]);

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <Fragment key={i}>{seg.value}</Fragment>;
        }
        if (seg.href === SHARE_LOCATION_HREF) {
          return (
            <button
              key={i}
              type="button"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                onShareLocation?.();
              }}
              className="mx-1 inline-flex items-center rounded-full bg-warm-500/15 px-3 py-1 align-baseline font-ui text-[13px] text-warm-700 transition-colors hover:bg-warm-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-500/60"
            >
              {seg.value}
            </button>
          );
        }
        const isInternal = seg.href.startsWith("/") || seg.href.startsWith("#");
        return (
          <a
            key={i}
            href={seg.href}
            target={isInternal ? undefined : "_blank"}
            rel={isInternal ? undefined : "noopener noreferrer"}
            className="underline decoration-warm-500 decoration-1 underline-offset-2 hover:text-warm-700"
          >
            {seg.value}
          </a>
        );
      })}
    </>
  );
}
