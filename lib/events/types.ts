// Shared types + constants for events. Importable from BOTH server and client.
// Server-only logic (DB queries, signed URLs) lives in lib/events/server.ts.

export type EventCategory =
  | "service"
  | "kids"
  | "youth"
  | "women"
  | "men"
  | "prayer"
  | "special"
  | "conference"
  | "general";

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "service", label: "Sunday service" },
  { value: "kids", label: "Kids" },
  { value: "youth", label: "Youth / Dreamers" },
  { value: "women", label: "Women / bU" },
  { value: "men", label: "Men" },
  { value: "prayer", label: "Prayer" },
  { value: "special", label: "Special service" },
  { value: "conference", label: "Conference / camp" },
  { value: "general", label: "Other" },
];

export type CampusEvent = {
  id: string;
  campus_slug: string;
  category: EventCategory;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  location: string | null;
  audience: string[];
  cover_image_path: string | null;
  registration_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  recurrence: "none" | "weekly" | "biweekly" | "monthly";
  series_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
};

export type CampusAnnouncement = {
  id: string;
  campus_slug: string;
  body: string;
  starts_at: string;
  ends_at: string | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
};

export type EventWithSignedImage = CampusEvent & { coverImageUrl: string | null };
