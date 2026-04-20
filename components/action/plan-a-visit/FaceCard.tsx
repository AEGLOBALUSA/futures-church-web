"use client";

import Image from "next/image";
import { useState } from "react";
import type { Face } from "@/lib/content/campus-faces";

/**
 * A single peer face. Marcus's rule: people are still. The only motion is a
 * gentle saturation shift on hover — "I see you." No lift, no rotate, no zoom.
 *
 * Two render modes:
 *   Placeholder (is_placeholder=true):
 *     photo + a single line "member of Futures {campus} family"
 *     no name, no age, no click, no story.
 *
 *   Released member (is_placeholder=false, release_signed=true):
 *     photo + first name + age_bracket + one_liner
 *     click/tap expands longer_story underneath
 *     fully keyboard accessible
 */
export function FaceCard({
  face,
  campusName,
}: {
  face: Face;
  campusName: string;
}) {
  const [open, setOpen] = useState(false);

  if (face.is_placeholder) {
    return (
      <figure className="group">
        <div className="relative aspect-square overflow-hidden rounded-md border border-warm-300/60">
          <Image
            src={face.headshot_url}
            alt={face.alt_text || `A member of the Futures ${campusName} family`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 160px"
            className="object-cover transition-[filter] duration-300 [filter:saturate(0.85)] group-hover:[filter:saturate(1)]"
            loading="lazy"
          />
        </div>
        <figcaption className="mt-3 font-body text-[12px] leading-[1.5] text-ink-600/80">
          a member of the Futures {campusName} family
        </figcaption>
      </figure>
    );
  }

  // Real member — must be signed to have reached this component.
  const canExpand = Boolean(face.longer_story);

  const inner = (
    <>
      <div className="relative aspect-square overflow-hidden rounded-md border border-warm-300">
        <Image
          src={face.headshot_url}
          alt={face.alt_text}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 160px"
          className="object-cover transition-[filter] duration-300 [filter:saturate(0.85)] group-hover:[filter:saturate(1)]"
          loading="lazy"
        />
      </div>
      <p
        className="mt-3 font-display italic text-ink-900"
        style={{ fontSize: 19, fontWeight: 300, lineHeight: 1.15 }}
      >
        {face.first_name}
        {face.age_bracket ? `, ${face.age_bracket}` : ""}
      </p>
      {face.one_liner && (
        <p className="mt-1 font-body text-[13px] leading-[1.5] text-ink-600">
          {face.one_liner}
        </p>
      )}
      {open && face.longer_story && (
        <p className="mt-3 max-w-[32ch] font-body text-[13px] leading-[1.65] text-ink-600">
          {face.longer_story}
        </p>
      )}
    </>
  );

  if (!canExpand) {
    return <figure className="group">{inner}</figure>;
  }

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-label={`Read ${face.first_name}'s story`}
      className="group rounded-lg p-2 text-left focus:outline-none focus:ring-2 focus:ring-warm-500/60"
    >
      {inner}
    </button>
  );
}
