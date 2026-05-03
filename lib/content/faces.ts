/**
 * Typed accessor for content/faces.json — the single source of truth for
 * every portrait on the home page.
 *
 * Components MUST import from here, never hardcode image URLs. Swapping a
 * placeholder for a real photo = one JSON edit, zero code changes.
 */

import raw from "@/content/faces.json";

export type FaceSource = "unsplash-placeholder" | "futures-comms";

export type HeroPortrait = {
  id: string;
  role: "large" | "medium" | "small";
  url: string;
  alt: string;
  name?: string;
  campus?: string;
  source: FaceSource;
};

/**
 * VoiceCard — kept as a typed shape for any future testimonial section.
 * The voices_row array in faces.json is currently empty; the placeholder
 * testimonials and Unsplash URLs were removed because they were never wired
 * into a component (HomeVoices reads from /photos/voices/voice_*.jpg directly).
 * Re-populate when real testimonials with model releases are ready.
 */
export type VoiceCard = {
  id: string;
  url: string;
  alt: string;
  name: string;
  campus: string;
  vocation: string;
  quote: string;
  source: FaceSource;
};

export type MosaicTile = {
  id: string;
  tile: "1x1" | "2x1" | "1x2" | "2x2";
  url: string;
  alt: string;
  name?: string;
  campus?: string;
  source: FaceSource;
};

export type CampusTile = {
  id: string;
  campus: string;
  service: string;
  city_size: string;
  launching: boolean;
  url: string;
  alt: string;
  source: FaceSource;
};

export type FooterPortrait = {
  id: string;
  url: string;
  alt: string;
  campus: string;
  source: FaceSource;
};

export type FacesRegistry = {
  hero_portraits: HeroPortrait[];
  voices_row: VoiceCard[];
  mosaic: MosaicTile[];
  campus_wall: CampusTile[];
  footer_strip: FooterPortrait[];
};

// Cast the JSON once. If we ever swap placeholder URLs for real assets, the
// schema stays stable and TypeScript catches drift.
const faces = raw as unknown as FacesRegistry & { _meta: unknown };

export const heroPortraits: HeroPortrait[] = faces.hero_portraits;
export const voicesRow: VoiceCard[] = faces.voices_row;
export const mosaic: MosaicTile[] = faces.mosaic;
export const campusWall: CampusTile[] = faces.campus_wall;
export const footerStrip: FooterPortrait[] = faces.footer_strip;

/** True once every entry in the registry has been swapped to real photos. */
export function isFacesProductionReady(): boolean {
  const all = [
    ...heroPortraits,
    ...voicesRow,
    ...mosaic,
    ...campusWall,
    ...footerStrip,
  ];
  return all.every((f) => f.source === "futures-comms");
}

/** Count of remaining placeholders, grouped by slot. Useful for launch gates. */
export function placeholderAudit(): Record<keyof FacesRegistry, number> {
  const count = <T extends { source: FaceSource }>(arr: T[]) =>
    arr.filter((x) => x.source === "unsplash-placeholder").length;
  return {
    hero_portraits: count(heroPortraits),
    voices_row: count(voicesRow),
    mosaic: count(mosaic),
    campus_wall: count(campusWall),
    footer_strip: count(footerStrip),
  };
}
