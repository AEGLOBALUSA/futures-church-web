/**
 * Campus pastor portraits — loader for Round 7 photography.
 *
 * Reads `content/campus-portraits/<slug>.json` per campus. Component consumers
 * treat an unsigned release as absence: they render nothing, leak nothing.
 *
 * When finals arrive, the photographer's PM flips `release_signed: true` and
 * fills in the asset paths. No code change needed.
 */

// Eager-load every portrait JSON. Next's bundler handles the glob.
// Each module default-exports the JSON object.
// Importing explicitly keeps TypeScript honest about shape.
import paradise from "@/content/campus-portraits/paradise.json";
import salisbury from "@/content/campus-portraits/salisbury.json";
import south from "@/content/campus-portraits/south.json";
import adelaideCity from "@/content/campus-portraits/adelaide-city.json";
import victorHarbor from "@/content/campus-portraits/victor-harbor.json";
import copperCoast from "@/content/campus-portraits/copper-coast.json";
import gwinnett from "@/content/campus-portraits/gwinnett.json";
import kennesaw from "@/content/campus-portraits/kennesaw.json";
import alpharetta from "@/content/campus-portraits/alpharetta.json";
import franklin from "@/content/campus-portraits/franklin.json";
import futurosDuluth from "@/content/campus-portraits/futuros-duluth.json";
import futurosGrayson from "@/content/campus-portraits/futuros-grayson.json";
import futurosKennesaw from "@/content/campus-portraits/futuros-kennesaw.json";

export type CampusPortraitSecondary = {
  subjects: string[];
  role: string;
  release_signed: boolean;
  hero: string | null;
  hero_fallback: string | null;
  alt: string;
};

export type CampusPortrait = {
  campus_slug: string;
  campus_name: string;
  subjects: string[];
  solo: boolean;
  spanish: boolean;
  pastors: boolean;
  photographer: string | null;
  shoot_date: string | null;
  release_signed: boolean;
  hero: string | null;
  hero_fallback: string | null;
  hero_webp: string | null;
  square: string | null;
  square_fallback: string | null;
  alt: string;
  dominant_hex: string | null;
  note_location_brief?: string;
  brief_slug_alias?: string;
  hero_secondary?: CampusPortraitSecondary;
};

const ALL: CampusPortrait[] = [
  paradise,
  salisbury,
  south,
  adelaideCity,
  victorHarbor,
  copperCoast,
  gwinnett,
  kennesaw,
  alpharetta,
  franklin,
  futurosDuluth,
  futurosGrayson,
  futurosKennesaw,
] as unknown as CampusPortrait[];

const BY_SLUG: Record<string, CampusPortrait> = Object.fromEntries(
  ALL.map((p) => [p.campus_slug, p]),
);

export function getCampusPortrait(slug: string): CampusPortrait | null {
  return BY_SLUG[slug] ?? null;
}

/** Returns the portrait only if the release is signed AND there's an asset path. Safe for rendering. */
export function getDisplayablePortrait(slug: string): CampusPortrait | null {
  const p = BY_SLUG[slug];
  if (!p) return null;
  if (!p.release_signed) return null;
  if (!p.hero && !p.hero_fallback) return null;
  return p;
}

export function getAllCampusPortraits(): CampusPortrait[] {
  return ALL;
}
