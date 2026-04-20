import raw from "@/content/campus-intros.json";
import { resolveCampusSlug } from "./slug-aliases";

export type CampusIntroLocale = {
  intro_line: string;
  blurb: string;
  saturday_text_line: string;
};

export type CampusIntroEntry = {
  en?: CampusIntroLocale;
  es?: CampusIntroLocale;
};

type RawShape = {
  campuses: Record<string, CampusIntroEntry>;
};

const data = raw as unknown as RawShape;

export function getCampusIntro(
  slug: string,
  locale: "en" | "es" = "en",
): CampusIntroLocale | null {
  const resolved = resolveCampusSlug(slug);
  const entry = data.campuses[resolved];
  if (!entry) return null;
  // Prefer requested locale; fall back to the other so nothing renders blank.
  return entry[locale] ?? entry.en ?? entry.es ?? null;
}

export function getCampusIntroLocales(slug: string): CampusIntroEntry | null {
  const resolved = resolveCampusSlug(slug);
  return data.campuses[resolved] ?? null;
}
