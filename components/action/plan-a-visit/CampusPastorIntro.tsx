"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CampusPastorPortrait } from "@/components/CampusPastorPortrait";
import { getCampusIntro } from "@/lib/content/campus-intros";
import {
  getCampusPortrait,
  getDisplayablePortrait,
} from "@/lib/content/campus-portraits";

/**
 * "Your pastors at {campus}" — Section 1 of the /plan-a-visit three-layer reveal.
 *
 * Uses the Round 7 <CampusPastorPortrait /> if a signed final is live. Until
 * the shoot lands, gracefully falls back to an editorial mood plate (soft
 * warm-brown tile with the pastor first names + intro line) so the section
 * has weight even before the photography arrives.
 *
 * Locale: respects the campus's own locale from the JSON (Futuros = es).
 * English-speaking visitors landing on a Futuros campus see the en fallback
 * automatically so nothing renders blank.
 */
export function CampusPastorIntro({
  campusSlug,
  campusName,
  locale = "en",
}: {
  campusSlug: string;
  campusName: string;
  locale?: "en" | "es";
}) {
  const intro = getCampusIntro(campusSlug, locale);
  const portraitRecord = getCampusPortrait(campusSlug);
  const displayable = getDisplayablePortrait(campusSlug);

  if (!intro) return null;

  const subjects = portraitRecord?.subjects ?? [];

  return (
    <motion.section
      key={campusSlug}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="mt-24 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start"
      aria-labelledby="pastor-intro-heading"
    >
      <div className="w-full">
        {displayable ? (
          <CampusPastorPortrait campusSlug={campusSlug} variant="hero" priority />
        ) : (
          <PortraitPlaceholder subjects={subjects} campusName={campusName} />
        )}
      </div>

      <div>
        <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-warm-700">
          your pastors at {campusName}
        </p>
        <h2
          id="pastor-intro-heading"
          className="mt-3 max-w-[28ch] font-display italic text-ink-900"
          style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.4rem)", fontWeight: 300, lineHeight: 1.25 }}
        >
          {intro.intro_line}
        </h2>
        {/* The longer personal `blurb` was deliberately removed from Step 1 of
            the visit form. Focus-group panel data showed front-loading a long
            personal note triggers "surveillance" reactions in never-churched
            and skeptic cohorts before they've committed. The portrait + name
            + one short greeting line carries the welcome without the weight. */}
      </div>
    </motion.section>
  );
}

/**
 * Warm editorial placeholder that holds the visual weight of the portrait
 * until the Round 7 shoot delivers. 3:4 so the slot doesn't reflow when
 * real photography drops in. Uses an existing Futures mosaic tile seeded
 * from the campus slug so each campus has its own warm texture.
 */
function PortraitPlaceholder({
  subjects,
  campusName,
}: {
  subjects: string[];
  campusName: string;
}) {
  const tileIndex = pickMosaicIndex(campusName);
  const src = `/photos/mosaic/mosaic_au_${tileIndex}.jpg`;
  const names = subjects.length > 0 ? subjects.join(" & ") : null;

  return (
    <figure
      className="relative aspect-[3/4] w-full overflow-hidden rounded-[22px]"
      style={{
        background: "#E8DFD3",
        boxShadow: "0 36px 72px -32px rgba(18,16,13,0.48)",
      }}
    >
      <Image
        src={src}
        alt={
          names
            ? `A moment from Futures ${campusName} — ${names}'s room.`
            : `A moment from Futures ${campusName}.`
        }
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        unoptimized
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(20,20,20,0.0) 45%, rgba(20,20,20,0.55) 100%)",
        }}
      />
      {names && (
        <figcaption className="absolute inset-x-6 bottom-6 text-white">
          <p
            className="font-ui"
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Futures {campusName}
          </p>
          <p
            className="mt-2 font-display italic"
            style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.1 }}
          >
            {names}
          </p>
        </figcaption>
      )}
    </figure>
  );
}

// Lightweight deterministic pick over the 72 mosaic tiles so every campus
// gets a different fallback texture without hardcoding assignments.
function pickMosaicIndex(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 60) + 1; // mosaic_au_1..60
}
