// The intake form each campus fills.
// Order = order shown to pastors. Keep prompts warm and conversational.
//
// IMPORTANT: pastors do NOT directly upload to structural slots (hero, gallery,
// pastor portrait, kids photo). Those slots are admin-curated. Pastors instead
// drop EVERYTHING they have into the photo repository (one big pool); admin
// picks which photos fill which slots from the curator at /intake/admin/[slug]/photos.

export type IntakeFieldType =
  | "text"
  | "longtext"
  | "email"
  | "phone"
  | "url"
  | "service-times"
  | "social"
  | "photo-repository"; // pastor's open photo pool — admin places into slots later

export interface IntakeField {
  key: string;
  label: string;
  helper?: string;
  type: IntakeFieldType;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  minPhotos?: number;
  maxPhotos?: number;
}

export interface IntakeSection {
  key: string;
  title: string;
  lead: string;
  icon: string;
  estimatedMinutes: number;
  fields: IntakeField[];
}

export const intakeSections: IntakeSection[] = [
  {
    key: "welcome",
    title: "Hello, family",
    lead: "Quick start — who are we talking to, and what language is home for your campus?",
    icon: "Hand",
    estimatedMinutes: 2,
    fields: [
      { key: "primary_contact_name", label: "Who's filling this in?", helper: "Your name — so we know who to thank.", type: "text", required: true },
      { key: "primary_contact_email", label: "Best email for you", helper: "We'll send a link back here so you can pick up later.", type: "email", required: true },
      { key: "primary_contact_role", label: "Your role at the campus", placeholder: "Lead pastor / admin / creative…", type: "text" },
      { key: "language", label: "Primary language of your campus", helper: "Pick the language your services are in.", type: "text", placeholder: "English / Spanish / Bahasa Indonesia", required: true },
    ],
  },
  {
    key: "story",
    title: "Tell us about your campus",
    lead: "Two short paragraphs. What's the heart of your campus? What kind of family are you?",
    icon: "BookOpen",
    estimatedMinutes: 6,
    fields: [
      { key: "story_short", label: "In one sentence", helper: "If a friend asked 'what's your church like?' — what would you say?", type: "longtext", maxLength: 200, required: true },
      { key: "story_long", label: "In a few paragraphs", helper: "Write like you're talking to a friend. No church-speak. Real.", type: "longtext", maxLength: 1500, required: true },
    ],
  },
  {
    key: "services",
    title: "When you gather",
    lead: "Service times exactly how you'd say them. If you have multiple, list them all.",
    icon: "Clock",
    estimatedMinutes: 3,
    fields: [
      { key: "services", label: "Your services", helper: "Day, time, and timezone. Add as many as you need.", type: "service-times", required: true },
      { key: "service_notes", label: "Anything to know?", helper: "Optional — kids program timing, special services, etc.", type: "longtext", maxLength: 400 },
    ],
  },
  {
    key: "pastors",
    title: "Your pastor couple",
    lead: "The faces of your campus — names, roles, and their story. We'll handle photo placement separately, so just write here.",
    icon: "Users",
    estimatedMinutes: 6,
    fields: [
      { key: "pastor_names", label: "Their names", placeholder: "e.g. Tony & Aste Corbridge", type: "text", required: true },
      { key: "pastor_role", label: "Their title", placeholder: "Lead Pastors / Campus Pastors", type: "text", required: true },
      { key: "pastor_bio_short", label: "A short bio (1-2 sentences)", helper: "What makes them them. Family, story, heart.", type: "longtext", maxLength: 280, required: true },
      { key: "pastor_bio_long", label: "Their longer story", helper: "Optional but powerful. Where they came from, what God's done in their life.", type: "longtext", maxLength: 1500 },
    ],
  },
  {
    key: "photos",
    title: "Photos — give us everything you've got",
    lead: "Drop every photo you have of your campus. People, kids, worship, the room, behind-the-scenes, anything. Tag what's in each one — we'll pick the best ones for the page.",
    icon: "Images",
    estimatedMinutes: 15,
    fields: [
      {
        key: "repository",
        label: "Your campus photo pool",
        helper: "Drag in as many as you want — no limit. We'll arrange them. Drop more anytime, even after launch.",
        type: "photo-repository",
        minPhotos: 8,
        required: true,
      },
    ],
  },
  {
    key: "address",
    title: "Where to find you",
    lead: "Make it easy for someone visiting for the first time.",
    icon: "MapPin",
    estimatedMinutes: 4,
    fields: [
      { key: "address_street", label: "Street address", type: "text", required: true },
      { key: "address_city", label: "City, state/region, postcode", type: "text", required: true },
      { key: "google_maps_url", label: "Google Maps link", helper: "Drop your campus pin and paste the share link.", type: "url" },
      { key: "parking", label: "Parking", helper: "Where to park, free or paid, any tricks for first-timers.", type: "longtext", maxLength: 400 },
      { key: "public_transport", label: "Public transport", helper: "Optional — bus / train / closest stop.", type: "longtext", maxLength: 300 },
    ],
  },
  {
    key: "contact",
    title: "How to reach you",
    lead: "The places people can find you online and the email a real human will reply to.",
    icon: "Mail",
    estimatedMinutes: 3,
    fields: [
      { key: "campus_email", label: "Campus email", helper: "Goes to a real person on your team.", type: "email", required: true },
      { key: "campus_phone", label: "Campus phone", type: "phone" },
      { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/...", type: "social" },
      { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/...", type: "social" },
      { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@...", type: "social" },
    ],
  },
  {
    key: "accessibility",
    title: "Welcoming everyone",
    lead: "Anything that helps someone with a disability, a kid, or a first-timer feel safe walking in.",
    icon: "Accessibility",
    estimatedMinutes: 4,
    fields: [
      { key: "wheelchair", label: "Wheelchair access", helper: "Yes / no / partial — describe entrances, ramps, bathrooms.", type: "longtext", maxLength: 400 },
      { key: "hearing", label: "Hearing accommodations", helper: "Hearing loop, captions on screens, sign language if available.", type: "longtext", maxLength: 300 },
      { key: "sensory", label: "Sensory-friendly notes", helper: "Quiet space, lighting, anything for kids/adults who need a calmer environment.", type: "longtext", maxLength: 300 },
      { key: "first_timer_help", label: "How do you help first-time visitors?", helper: "Greeters at the door, a welcome desk, a follow-up — whatever you actually do.", type: "longtext", maxLength: 400 },
    ],
  },
  {
    key: "kids",
    title: "What Kids' Church is like",
    lead: "Parents need to know their kids are safe, loved, and having a great time.",
    icon: "Baby",
    estimatedMinutes: 4,
    fields: [
      { key: "kids_overview", label: "Tell us about your Kids' Church", helper: "Age groups, what happens, who runs it.", type: "longtext", maxLength: 800, required: true },
      { key: "kids_safety", label: "Your safety / check-in process", helper: "How parents drop off and pick up. Builds trust.", type: "longtext", maxLength: 600 },
    ],
  },
  {
    key: "groups",
    title: "Connect groups & community",
    lead: "How does someone go from Sunday-only to part of the family?",
    icon: "Users2",
    estimatedMinutes: 4,
    fields: [
      { key: "groups_overview", label: "Your groups in your words", helper: "What you call them, where they meet, who they're for.", type: "longtext", maxLength: 800 },
      { key: "groups_signup_url", label: "Sign-up or info link", helper: "Optional — if there's a page or form people can use.", type: "url" },
    ],
  },
  {
    key: "welcome-message",
    title: "A word from the pastors",
    lead: "A short welcome message from your pastors. Text or a video link — your call.",
    icon: "MessageCircle",
    estimatedMinutes: 5,
    fields: [
      { key: "welcome_text", label: "If text — write it here", helper: "Like you're greeting someone at the door for the first time.", type: "longtext", maxLength: 800 },
      { key: "welcome_video_url", label: "If video — paste the link", helper: "YouTube, Vimeo, or Loom. Aim for 30 seconds.", type: "url" },
    ],
  },
  {
    key: "distinctive",
    title: "What makes your campus different",
    lead: "Every campus has something. What's yours? Be honest, be specific, be proud.",
    icon: "Sparkles",
    estimatedMinutes: 5,
    fields: [
      { key: "distinctive", label: "Tell us", helper: "Could be the people, the city, a ministry, the music, the kids program, the building. Anything that makes someone say 'oh THAT campus.'", type: "longtext", maxLength: 1000, required: true },
    ],
  },
  {
    key: "anything-else",
    title: "Anything else we should know",
    lead: "Stories, dreams, prayer points, things to be careful about, things to celebrate. This is your space.",
    icon: "Heart",
    estimatedMinutes: 3,
    fields: [
      { key: "notes", label: "Open mic", helper: "Anything you want us to know. We read every word.", type: "longtext", maxLength: 2000 },
    ],
  },
];

export function getSectionByKey(key: string): IntakeSection | undefined {
  return intakeSections.find((s) => s.key === key);
}

export const totalEstimatedMinutes = intakeSections.reduce(
  (sum, s) => sum + s.estimatedMinutes,
  0
);

// The seven category tags pastors apply to repository photos.
export const PHOTO_CATEGORIES = [
  { value: "people", label: "People" },
  { value: "kids", label: "Kids" },
  { value: "venue", label: "Venue" },
  { value: "worship", label: "Worship" },
  { value: "event", label: "Event" },
  { value: "pastors", label: "Pastors" },
  { value: "other", label: "Other" },
] as const;

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number]["value"];

// Field is "complete" if it has any non-empty value.
// photo-repository completes when minPhotos is met.
export function isFieldComplete(
  field: IntakeField,
  value: unknown,
  photoCount = 0
): boolean {
  if (field.type === "photo-repository") {
    return photoCount >= (field.minPhotos ?? 1);
  }
  if (field.type === "service-times") {
    return Array.isArray(value) && value.length > 0;
  }
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  if (typeof value === "boolean") return value;
  return value != null;
}

export function computeProgressPct(
  responses: Record<string, Record<string, unknown>>,
  photoCounts: Record<string, number>
): number {
  let total = 0;
  let filled = 0;
  for (const section of intakeSections) {
    for (const field of section.fields) {
      if (!field.required) continue;
      total += 1;
      const value = responses[section.key]?.[field.key];
      const photoCount = photoCounts[`${section.key}:${field.key}`] ?? 0;
      if (isFieldComplete(field, value, photoCount)) filled += 1;
    }
  }
  return total === 0 ? 0 : Math.round((filled / total) * 100);
}
