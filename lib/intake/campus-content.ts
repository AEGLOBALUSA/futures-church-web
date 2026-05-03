// Merge intake_response data on top of the static campus voice / photo readers.
// Used by /campuses/[slug] so the moment a pastor finishes their intake, the
// public campus page lights up with their actual words and photos — no code
// change, no manual content sync.

import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getCampusVoice, type CampusVoice } from "@/lib/content/campus-voices";
import { getSignedPhotoUrl } from "./server";

type IntakeResponseRow = {
  section_key: string;
  field_key: string;
  value: unknown;
};

type IntakePhotoRow = {
  id: string;
  section_key: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
};

type CampusIntakeBundle = {
  responses: IntakeResponseRow[];
  photos: IntakePhotoRow[];
} | null;

async function loadIntake(slug: string): Promise<CampusIntakeBundle> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServiceClient();

  const [responses, photos] = await Promise.all([
    supabase
      .from("intake_response")
      .select("section_key, field_key, value")
      .eq("campus_slug", slug),
    supabase
      .from("intake_photo")
      .select("id, section_key, storage_path, caption, sort_order")
      .eq("campus_slug", slug)
      .order("section_key")
      .order("sort_order"),
  ]);

  // If the intake tables don't exist yet, both calls error gracefully.
  if (responses.error || photos.error) return null;

  return {
    responses: (responses.data ?? []) as IntakeResponseRow[],
    photos: (photos.data ?? []) as IntakePhotoRow[],
  };
}

function val(rows: IntakeResponseRow[], section: string, field: string): unknown {
  return rows.find((r) => r.section_key === section && r.field_key === field)?.value;
}

function strVal(rows: IntakeResponseRow[], section: string, field: string): string | null {
  const v = val(rows, section, field);
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function nonEmpty<T>(value: T | null | undefined): value is T {
  return value != null && value !== "" && !(Array.isArray(value) && value.length === 0);
}

/**
 * Returns a merged CampusVoice — intake values win over static, missing intake
 * fields fall back to whatever's in `campus-voices.ts`. If intake is unavailable
 * or empty, returns the static voice unchanged.
 */
export async function getMergedCampusVoice(slug: string): Promise<CampusVoice> {
  const fallback = getCampusVoice(slug);
  const intake = await loadIntake(slug);
  if (!intake || intake.responses.length === 0) return fallback;

  const r = intake.responses;

  // Intake → Voice field mapping.
  // story_long is the long-form "tell us about your campus" prose.
  const whatToExpect = strVal(r, "story", "story_long");
  // story_short is the one-sentence answer to "what's your church like?"
  const firstTimeLine = strVal(r, "story", "story_short");
  // distinctive becomes the bulleted "Only at <campus>" list.
  // Pastors fill it as prose; we split on newlines / bullets to get specifics.
  const distinctiveText = strVal(r, "distinctive", "distinctive");
  const distinctiveList = distinctiveText
    ? distinctiveText
        .split(/\n+/)
        .map((line) => line.replace(/^[\s\-•·*]+/, "").trim())
        .filter((line) => line.length > 4)
    : null;

  // Pastor bio — prefer the long version, fall back to the short.
  const pastorBio =
    strVal(r, "pastors", "pastor_bio_long") ??
    strVal(r, "pastors", "pastor_bio_short");

  // Kids — pastors fill kids_overview prose.
  const kidsBlock = strVal(r, "kids", "kids_overview");

  // Once a pastor has touched intake, the page is no longer "draft" scaffolding.
  const merged: CampusVoice = {
    whatToExpect: whatToExpect ?? fallback.whatToExpect,
    firstTimeLine: firstTimeLine ?? fallback.firstTimeLine,
    specifics: nonEmpty(distinctiveList) ? distinctiveList : fallback.specifics,
    pastorBio: pastorBio ?? fallback.pastorBio,
    kidsBlock: kidsBlock ?? fallback.kidsBlock,
    // If ANY intake response exists, the live content is no longer a draft.
    isDraft: false,
  };
  return merged;
}

export type CampusIntakePhoto = {
  id: string;
  url: string | null;
  caption: string | null;
  sectionKey: string;
};

export type CampusIntakePhotos = {
  hero: CampusIntakePhoto | null;
  gallery: CampusIntakePhoto[];
  pastorPhoto: CampusIntakePhoto | null;
  kidsPhoto: CampusIntakePhoto | null;
};

/**
 * Returns the photos a pastor uploaded via intake, with signed URLs ready to
 * pass straight to <Image>. Returns nulls/empty arrays when nothing is uploaded
 * yet — the page should fall back to its existing static photos.
 */
export async function getCampusIntakePhotos(slug: string): Promise<CampusIntakePhotos> {
  const empty: CampusIntakePhotos = {
    hero: null,
    gallery: [],
    pastorPhoto: null,
    kidsPhoto: null,
  };
  const intake = await loadIntake(slug);
  if (!intake || intake.photos.length === 0) return empty;

  const photosBySection: Record<string, IntakePhotoRow[]> = {};
  for (const p of intake.photos) {
    if (!photosBySection[p.section_key]) photosBySection[p.section_key] = [];
    photosBySection[p.section_key].push(p);
  }

  async function makeOne(p: IntakePhotoRow | undefined): Promise<CampusIntakePhoto | null> {
    if (!p) return null;
    const url = await getSignedPhotoUrl(p.storage_path, 3600);
    return { id: p.id, url, caption: p.caption, sectionKey: p.section_key };
  }

  async function makeMany(list: IntakePhotoRow[] | undefined): Promise<CampusIntakePhoto[]> {
    if (!list || list.length === 0) return [];
    return Promise.all(
      list.map(async (p) => ({
        id: p.id,
        url: await getSignedPhotoUrl(p.storage_path, 3600),
        caption: p.caption,
        sectionKey: p.section_key,
      }))
    );
  }

  const [hero, gallery, pastorPhoto, kidsPhoto] = await Promise.all([
    makeOne(photosBySection["hero-photo"]?.[0]),
    makeMany(photosBySection["gallery"]),
    makeOne(photosBySection["pastors"]?.[0]),
    makeOne(photosBySection["kids"]?.[0]),
  ]);

  return { hero, gallery, pastorPhoto, kidsPhoto };
}

export type CampusIntakeFacts = {
  /** True if pastor has filled in welcome (= touched the form at all). */
  hasAnyIntake: boolean;
  /** Service times array from intake [{day,time,timezone}]. */
  serviceTimes: Array<{ day: string; time: string; timezone: string }>;
  /** Address parts from intake. */
  addressStreet: string | null;
  addressCity: string | null;
  googleMapsUrl: string | null;
  parking: string | null;
  publicTransport: string | null;
  /** Contact info from intake. */
  campusEmail: string | null;
  campusPhone: string | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  /** Accessibility notes. */
  wheelchair: string | null;
  hearing: string | null;
  sensory: string | null;
  /** Pastor names + role, exactly as the campus wrote them. */
  pastorNames: string | null;
  pastorRole: string | null;
  /** Welcome note from the pastors (text or video URL). */
  welcomeText: string | null;
  welcomeVideoUrl: string | null;
};

/**
 * Returns flat, easy-to-render facts pulled from intake.
 * Useful for Milo, for the address card, for the contact strip.
 */
export async function getCampusIntakeFacts(slug: string): Promise<CampusIntakeFacts> {
  const empty: CampusIntakeFacts = {
    hasAnyIntake: false,
    serviceTimes: [],
    addressStreet: null,
    addressCity: null,
    googleMapsUrl: null,
    parking: null,
    publicTransport: null,
    campusEmail: null,
    campusPhone: null,
    instagram: null,
    facebook: null,
    youtube: null,
    wheelchair: null,
    hearing: null,
    sensory: null,
    pastorNames: null,
    pastorRole: null,
    welcomeText: null,
    welcomeVideoUrl: null,
  };
  const intake = await loadIntake(slug);
  if (!intake) return empty;

  const r = intake.responses;
  if (r.length === 0) return empty;

  const services = val(r, "services", "services");
  const serviceTimes = Array.isArray(services)
    ? (services as Array<{ day: string; time: string; timezone: string }>).filter(
        (s) => s && (s.day || s.time)
      )
    : [];

  return {
    hasAnyIntake: true,
    serviceTimes,
    addressStreet: strVal(r, "address", "address_street"),
    addressCity: strVal(r, "address", "address_city"),
    googleMapsUrl: strVal(r, "address", "google_maps_url"),
    parking: strVal(r, "address", "parking"),
    publicTransport: strVal(r, "address", "public_transport"),
    campusEmail: strVal(r, "contact", "campus_email"),
    campusPhone: strVal(r, "contact", "campus_phone"),
    instagram: strVal(r, "contact", "instagram"),
    facebook: strVal(r, "contact", "facebook"),
    youtube: strVal(r, "contact", "youtube"),
    wheelchair: strVal(r, "accessibility", "wheelchair"),
    hearing: strVal(r, "accessibility", "hearing"),
    sensory: strVal(r, "accessibility", "sensory"),
    pastorNames: strVal(r, "pastors", "pastor_names"),
    pastorRole: strVal(r, "pastors", "pastor_role"),
    welcomeText: strVal(r, "welcome-message", "welcome_text"),
    welcomeVideoUrl: strVal(r, "welcome-message", "welcome_video_url"),
  };
}
