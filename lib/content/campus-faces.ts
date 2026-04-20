import raw from "@/content/campus-faces.json";
import { resolveCampusSlug } from "./slug-aliases";

export type Face = {
  id: string;
  first_name: string | null;
  age_bracket: string | null;
  headshot_url: string;
  headshot_fallback: string | null;
  alt_text: string;
  one_liner: string | null;
  longer_story: string | null;
  release_signed: boolean;
  is_placeholder: boolean;
  date_added: string;
};

export type CampusFaceEntry = {
  campus_name: string;
  locale: "en" | "es";
  campus_pastor_first_names: string[];
  assistant_first_names?: string[];
  brief_slug_alias?: string;
  faces: Face[];
};

type RawShape = {
  campuses: Record<string, CampusFaceEntry>;
};

const data = raw as unknown as RawShape;

export function getCampusFaceEntry(slug: string): CampusFaceEntry | null {
  const resolved = resolveCampusSlug(slug);
  return data.campuses[resolved] ?? null;
}

/**
 * Faces to render: applies rotation + gating rules.
 *
 * Gating (from JSON._meta.gatingRules):
 *  - is_placeholder === true → render (photo + generic label, no click)
 *  - is_placeholder === false && release_signed === true → render (full card with expand)
 *  - any other combination → filtered out (never leak an unsigned real person)
 *
 * Rotation: deterministic monthly seed picks the window of `count` faces.
 * Same month + same campus = same faces. New month = reshuffle.
 */
export function pickFacesForCampus(
  slug: string,
  count = 6,
  now: Date = new Date(),
): { faces: Face[]; entry: CampusFaceEntry | null } {
  const entry = getCampusFaceEntry(slug);
  if (!entry) return { faces: [], entry: null };

  const visible = entry.faces.filter((f) => {
    if (f.is_placeholder) return true;
    return f.release_signed === true;
  });

  if (visible.length === 0) return { faces: [], entry };

  const seed = seedFor(entry.campus_pastor_first_names.join("-") + ":" + slug, now);
  const offset = seed % visible.length;
  const rotated = [...visible.slice(offset), ...visible.slice(0, offset)];
  return { faces: rotated.slice(0, count), entry };
}

function seedFor(key: string, now: Date): number {
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const s = `${key}:${ym}`;
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
