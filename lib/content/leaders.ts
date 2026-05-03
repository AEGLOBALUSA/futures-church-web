// Unified leader registry — combines senior-pastors.json (Ashley & Jane, full
// authored bios) with campus-pastors.json (one-line + pastor names per campus).
// Generates stable slugs so /leaders/[slug] can render a bio page for any of them.
//
// Bios for campus pastors come from intake_response.pastor_bio_long once a
// pastor has filled in their intake form. Until then the page shows a warm
// placeholder + their one-line + a link to their campus.

import seniorPastorsJson from "@/content/leaders/senior-pastors.json";
import campusPastorsJson from "@/content/leaders/campus-pastors.json";
import { campuses } from "./campuses";

export type LeaderKind = "senior" | "campus";

export type Leader = {
  slug: string;
  kind: LeaderKind;
  name: string;
  role: string;
  photo: string | null;
  /** True when the photo is a generic stock placeholder, not a real portrait. */
  photoPlaceholder: boolean;
  /** For campus pastors: which campus they lead. */
  campusSlug: string | null;
  campusName: string | null;
  campusCity: string | null;
  /** Authored bio paragraphs (from senior-pastors.json). Empty for campus pastors. */
  bioParagraphs: string[];
  /** One-line intro from campus-pastors.json (campus pastors only). */
  oneLine: string | null;
  /** External links (instagram, podcast, etc). */
  links: { label: string; href: string }[];
  /** Optional book titles (from senior-pastors.json). */
  books: string[];
};

type SeniorPastorJson = {
  slug: string;
  name: string;
  role: string;
  photo: string;
  bio: string[];
  books?: string[];
  links?: { label: string; href: string }[];
};

type CampusPastorJson = {
  slug: string;
  campusName: string;
  city: string;
  country: string;
  plantedYear: number;
  status: string;
  oneLine: string;
  pastors: Array<{
    name: string;
    role: string;
    photo: string;
    placeholder: boolean;
  }>;
};

function slugifyName(name: string): string {
  return name
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildLeaders(): Leader[] {
  const seniors = (seniorPastorsJson as SeniorPastorJson[]).map<Leader>((s) => ({
    slug: s.slug,
    kind: "senior",
    name: s.name,
    role: s.role,
    photo: s.photo,
    photoPlaceholder: false,
    campusSlug: null,
    campusName: null,
    campusCity: null,
    bioParagraphs: s.bio ?? [],
    oneLine: null,
    links: s.links ?? [],
    books: s.books ?? [],
  }));

  const campusEntries = campusPastorsJson as CampusPastorJson[];
  const seenSlugs = new Set(seniors.map((s) => s.slug));
  const campusLeaders: Leader[] = [];

  for (const entry of campusEntries) {
    const realPastors = entry.pastors.filter(
      (p) => !p.placeholder && !p.name.toLowerCase().startsWith("lead pastor")
    );
    if (realPastors.length === 0) continue;

    const primary = realPastors[0];
    let displayName = primary.name;
    if (realPastors.length === 2 && !primary.name.includes("&")) {
      displayName = `${primary.name} & ${realPastors[1].name}`;
    }

    let slug = slugifyName(displayName);
    if (seenSlugs.has(slug)) slug = `${entry.slug}-${slug}`;
    seenSlugs.add(slug);

    campusLeaders.push({
      slug,
      kind: "campus",
      name: displayName,
      role: primary.role,
      photo: primary.photo,
      photoPlaceholder: primary.placeholder,
      campusSlug: entry.slug,
      campusName: entry.campusName,
      campusCity: entry.city,
      bioParagraphs: [],
      oneLine: entry.oneLine ?? null,
      links: [],
      books: [],
    });
  }

  return [...seniors, ...campusLeaders];
}

const ALL_LEADERS: Leader[] = buildLeaders();

export function getAllLeaders(): Leader[] {
  return ALL_LEADERS;
}

export function getLeaderBySlug(slug: string): Leader | undefined {
  return ALL_LEADERS.find((l) => l.slug === slug);
}

export function getAllLeaderSlugs(): string[] {
  return ALL_LEADERS.map((l) => l.slug);
}

export function getLeaderCampus(slug: string) {
  const leader = getLeaderBySlug(slug);
  if (!leader || !leader.campusSlug) return null;
  return campuses.find((c) => c.slug === leader.campusSlug) ?? null;
}

// Backward-compat shim — preserve the previous `leaders` array shape for any
// existing consumer (e.g. other home/about components built against the old
// schema). Returns the senior pastors only, in the legacy field names.
export const leaders = (seniorPastorsJson as SeniorPastorJson[]).map((s) => ({
  id: s.slug.split("-")[0],
  name: s.name,
  title: s.role,
  bio: (s.bio ?? []).join("\n\n"),
  books: s.books ?? [],
  instagram: s.links?.find((l) => l.label.toLowerCase() === "instagram")?.href ?? "",
  image: s.photo,
}));
