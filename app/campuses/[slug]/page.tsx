import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Instagram, Facebook } from "lucide-react";
import { campuses, type CampusRegion } from "@/lib/content/campuses";
import { CAMPUS_PHOTOS, CAMPUS_GALLERY } from "../CampusesMap";
import campusPastorsData from "@/content/leaders/campus-pastors.json";
import { EmailCapture } from "@/components/ui/EmailCapture";
import { CampusAIPanel } from "./CampusAIPanel";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { CampusPastorPortrait } from "@/components/CampusPastorPortrait";
import {
  getDisplayablePortrait,
  getCampusPortrait,
} from "@/lib/content/campus-portraits";
import {
  getMergedCampusVoice,
  getCampusIntakePhotos,
  getCampusIntakeFacts,
} from "@/lib/intake/campus-content";
import { PendingNote } from "@/components/campus/PendingNote";
import { getCampusEvents, getNextServiceEvent } from "@/lib/events/server";
import { ThisSundayStrip, ComingUpRail } from "@/components/events/CampusEventsSection";
import { EditableText } from "@/components/edit/EditableText";
import { JsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";

const REGION_LABEL: Record<CampusRegion, string> = {
  australia: "Australia",
  usa: "United States",
  indonesia: "Indonesia",
  "south-america": "Venezuela",
  brazil: "Brazil",
  global: "Online",
};

const REGION_TONE: Record<CampusRegion, string> = {
  australia: "#C8906B",
  usa: "#AC9B25",
  indonesia: "#C45236",
  "south-america": "#8A5A3C",
  brazil: "#4A7C59",
  global: "#D9B089",
};

// Deliberately no shared "What to expect" copy here. Each campus speaks for
// itself via lib/content/campus-voices.ts. Until a campus returns answers,
// the page renders a visible <PendingNote /> placeholder — never generic fill.

export async function generateStaticParams() {
  return campuses.map((c) => ({ slug: c.slug }));
}

// Regenerate every minute so intake updates appear on the live page within ~60s
// of a pastor saving — without forcing a full dynamic render on every request.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campus = campuses.find((c) => c.slug === slug);
  if (!campus) return {};
  // Prefer the signed Round 7 pastor portrait for social sharing — it's the
  // emotional center. Fall back to the venue photo if unsigned / unshot.
  const portrait = getDisplayablePortrait(slug);
  const ogImage = portrait?.square ?? portrait?.hero ?? portrait?.hero_fallback ?? CAMPUS_PHOTOS[campus.slug] ?? null;
  return {
    title: `${campus.name} · Futures Church`,
    description: `Futures Church ${campus.name} — ${campus.city}. ${
      campus.status === "launching" ? "Launching soon." : "Join us this Sunday."
    }`,
    openGraph: {
      title: `${campus.name} · Futures Church`,
      description: `${campus.city} · ${REGION_LABEL[campus.region]}`,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function CampusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campus = campuses.find((c) => c.slug === slug);
  if (!campus) notFound();

  const isLaunching = campus.status === "launching";
  const isOnline = campus.status === "online";
  const tone = REGION_TONE[campus.region];
  const staticPhoto = CAMPUS_PHOTOS[campus.slug];
  const staticGallery = CAMPUS_GALLERY[campus.slug] ?? [];
  const nearby = campuses
    .filter((c) => c.region === campus.region && c.slug !== campus.slug)
    .slice(0, 4);

  const campusPastorEntry = (campusPastorsData as Array<{ slug: string; pastors: Array<{ name: string; role: string; photo: string; placeholder: boolean }> }>).find(c => c.slug === slug);
  const pastoralPhoto = campusPastorEntry?.pastors.find(p => !p.placeholder) ?? null;

  // Pull merged voice + intake photos + intake facts + events in parallel.
  // Each falls back gracefully when its data source isn't filled in yet.
  const [voice, intakePhotos, intakeFacts, nextService, upcomingEvents] = await Promise.all([
    getMergedCampusVoice(slug),
    getCampusIntakePhotos(slug),
    getCampusIntakeFacts(slug),
    getNextServiceEvent(slug),
    getCampusEvents(slug, { from: new Date() }),
  ]);
  // Filter the upcoming list to exclude the "This Sunday" hero event so it doesn't double up.
  const comingUp = nextService
    ? upcomingEvents.filter((e) => e.id !== nextService.id)
    : upcomingEvents;

  // Intake hero photo wins when present (it's the pastor's own pick).
  const photo = intakePhotos.hero?.url ?? staticPhoto;
  // Combine intake gallery (front) with static (back), de-duped by URL.
  const intakeGalleryUrls = intakePhotos.gallery.map((g) => g.url).filter((u): u is string => !!u);
  const gallery = [...intakeGalleryUrls, ...staticGallery.filter((s) => !intakeGalleryUrls.includes(s))];

  // Intake socials override the static ones.
  const instagramUrl = intakeFacts.instagram ?? campus.instagram;
  const facebookUrl = intakeFacts.facebook ?? campus.facebook;

  // Service-time line: prefer intake (pastor's words), fall back to campus.serviceTime placeholder.
  const serviceLine =
    intakeFacts.serviceTimes.length > 0
      ? intakeFacts.serviceTimes
          .map((s) => [s.day, s.time, s.timezone].filter(Boolean).join(" · "))
          .join("  +  ")
      : campus.serviceTime ?? null;
  const pastorFirstNames = campus.leadPastors
    ? campus.leadPastors.split(" & ").map((n) => n.split(" ")[0]).join(" & ")
    : "the pastoral team";
  const voiceHasAnyCopy = Boolean(
    voice.whatToExpect || (voice.specifics && voice.specifics.length > 0) ||
      voice.firstTimeLine || voice.pastorBio || voice.kidsBlock,
  );
  const showDraftRibbon = voiceHasAnyCopy && voice.isDraft === true;

  // Round 7 — pastor portrait (new, signed-release-gated). If present, it takes
  // the hero's right column and the legacy pastoralPhoto editorial block is
  // skipped (otherwise we'd show the same portrait twice).
  const pastorPortrait = getDisplayablePortrait(slug);
  const pastorPortraitRecord = getCampusPortrait(slug);
  const hasSignedSecondary = Boolean(
    pastorPortraitRecord?.hero_secondary?.release_signed &&
      (pastorPortraitRecord.hero_secondary.hero ||
        pastorPortraitRecord.hero_secondary.hero_fallback),
  );

  // Church + Place schemas — give Google + LLMs a structured sense of where
  // this campus is and how to reach it. Helps "[city] church" queries return
  // us with a rich card.
  const churchSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: `Futures Church ${campus.name}`,
    url: `${SITE_URL}/campuses/${campus.slug}`,
    image: photo ?? undefined,
    parentOrganization: {
      "@type": "Organization",
      name: "Futures Church",
      url: SITE_URL,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: intakeFacts.addressStreet ?? campus.address ?? undefined,
      addressLocality: intakeFacts.addressCity ?? campus.city,
      addressCountry: campus.country,
    },
    geo:
      campus.lat && campus.lng
        ? { "@type": "GeoCoordinates", latitude: campus.lat, longitude: campus.lng }
        : undefined,
    email: intakeFacts.campusEmail ?? "hello@futures.church",
    telephone: intakeFacts.campusPhone ?? undefined,
    sameAs: [instagramUrl, facebookUrl, intakeFacts.youtube].filter((u): u is string => !!u),
    areaServed: campus.city,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Campuses", item: `${SITE_URL}/campuses` },
      { "@type": "ListItem", position: 3, name: campus.name, item: `${SITE_URL}/campuses/${campus.slug}` },
    ],
  };

  return (
    <main className="bg-[#FDFBF6] text-[#1C1A17] selection:bg-[#C8906B] selection:text-[#FDFBF6]">
      <JsonLd data={[churchSchema, breadcrumbSchema]} />
      <section className="relative px-6 pt-28 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href={`/campuses?country=${campus.region}`}
            scroll={false}
            className="group inline-flex items-center gap-2 font-sans"
            style={{ color: "#534D44", fontSize: 13 }}
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={2}
            />
            <span>Futures · {REGION_LABEL[campus.region]}</span>
          </Link>

          <div className={`mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] ${pastorPortrait ? "lg:items-end" : "lg:items-center"}`}>
            <div>
              <div className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: tone }}
                />
                <p
                  className="font-sans"
                  style={{
                    color: "#534D44",
                    fontSize: 11,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  {campus.brand === "futuros" ? "Futuros" : "Futures"} · {campus.city}
                </p>
              </div>

              <h1
                className="mt-4 font-display italic"
                style={{
                  color: "#1C1A17",
                  fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
                  lineHeight: 1,
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                }}
              >
                {campus.name}
              </h1>

              {campus.leadPastors && !pastorPortrait && (
                <p
                  className="mt-6 font-sans"
                  style={{ color: "#534D44", fontSize: 16, lineHeight: 1.6 }}
                >
                  Led by{" "}
                  <span style={{ color: "#1C1A17" }}>{campus.leadPastors}</span>
                </p>
              )}

              {(intakeFacts.addressStreet || campus.address) && (
                <div className="mt-3 flex items-center gap-2 font-sans" style={{ color: "#534D44", fontSize: 14 }}>
                  <MapPin className="h-4 w-4" style={{ color: tone }} strokeWidth={1.8} />
                  <span>
                    {intakeFacts.addressStreet ?? campus.address}
                    {", "}
                    {intakeFacts.addressCity ?? campus.city}
                  </span>
                </div>
              )}

              {!isLaunching && !isOnline && serviceLine && (
                <p
                  className="mt-2 font-display italic"
                  style={{
                    color: "#1C1A17",
                    fontSize: 17,
                    fontWeight: 300,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {serviceLine}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {isLaunching ? (
                  <span
                    className="inline-flex rounded-full px-3 py-1.5 font-sans"
                    style={{
                      background: "rgba(253,251,246,0.92)",
                      border: `1px solid ${tone}`,
                      color: "#1C1A17",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                    }}
                  >
                    Launching · 2026
                  </span>
                ) : isOnline ? (
                  <Link
                    href="/watch"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ background: tone, color: "#FDFBF6", fontSize: 14 }}
                  >
                    Join a service →
                  </Link>
                ) : (
                  <Link
                    href="/plan-a-visit"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ background: tone, color: "#FDFBF6", fontSize: 14 }}
                  >
                    Plan a visit →
                  </Link>
                )}

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                    style={{ border: "1px solid rgba(28,26,23,0.12)", color: "#534D44" }}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" strokeWidth={1.6} />
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                    style={{ border: "1px solid rgba(28,26,23,0.12)", color: "#534D44" }}
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" strokeWidth={1.6} />
                  </a>
                )}
              </div>
            </div>

            {pastorPortrait ? (
              <div className="flex w-full items-end gap-4">
                <CampusPastorPortrait campusSlug={slug} variant="hero" priority />
                {hasSignedSecondary && (
                  <div className="hidden w-[34%] lg:block">
                    <CampusPastorPortrait
                      campusSlug={slug}
                      variant="hero"
                      position="secondary"
                    />
                    <p
                      className="mt-3 font-sans"
                      style={{
                        color: "#534D44",
                        fontSize: 10,
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                      }}
                    >
                      Also on staff ·{" "}
                      {pastorPortraitRecord?.hero_secondary?.subjects.join(" & ")}
                    </p>
                  </div>
                )}
              </div>
            ) : photo ? (
              <div
                className="relative aspect-[5/4] w-full overflow-hidden rounded-[22px]"
                style={{
                  background: tone,
                  boxShadow: "0 30px 60px -28px rgba(20,20,20,0.32)",
                }}
              >
                <Image
                  src={photo}
                  alt={`${campus.name} — ${campus.city}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: tone, mixBlendMode: "soft-light", opacity: 0.28 }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(28,26,23,0.45) 100%)",
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {nextService && (
        <section className="px-6 -mt-2 pb-12 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <ThisSundayStrip event={nextService} tone={tone} campusName={campus.name} />
          </div>
        </section>
      )}

      {pastoralPhoto && !pastorPortrait && (
        <section className="px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[5fr_7fr]">

              {/* Portrait photo — natural 2:3, full quality */}
              <div
                className="group relative w-full overflow-hidden rounded-[28px]"
                style={{
                  aspectRatio: "2/3",
                  background: tone,
                  boxShadow: "0 48px 96px -32px rgba(18,16,13,0.52)",
                }}
              >
                <Image
                  src={pastoralPhoto.photo}
                  alt={pastoralPhoto.name}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-[3500ms] ease-out group-hover:scale-[1.03]"
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: tone, mixBlendMode: "soft-light", opacity: 0.1 }}
                />
              </div>

              {/* Name + role — large editorial type */}
              <div className="lg:pb-14">
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: tone }}
                  />
                  <p
                    className="font-sans"
                    style={{
                      color: "#534D44",
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                    }}
                  >
                    Led by
                  </p>
                </div>

                <h2
                  className="mt-6 font-display italic"
                  style={{
                    color: "#1C1A17",
                    fontSize: "clamp(2.75rem, 5.5vw, 5rem)",
                    fontWeight: 300,
                    lineHeight: 1.0,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {pastoralPhoto.name}
                </h2>

                <p
                  className="mt-5 font-sans"
                  style={{
                    color: "#534D44",
                    fontSize: 11,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  {pastoralPhoto.role} · {campus.name}
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {isLaunching && (
        <section className="px-6 py-16 sm:px-10 lg:px-16">
          <div
            className="mx-auto max-w-3xl rounded-[22px] p-10 text-center"
            style={{
              background: "#FFFDF8",
              border: "1px solid rgba(28,26,23,0.08)",
              boxShadow: "0 20px 40px -28px rgba(20,20,20,0.18)",
            }}
          >
            <p
              className="font-sans"
              style={{
                color: "#534D44",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Be first through the doors
            </p>
            <h2
              className="mt-4 font-display italic"
              style={{ color: "#1C1A17", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1.1, fontWeight: 300 }}
            >
              We&apos;ll let you know the moment this campus goes live.
            </h2>
            <div className="mx-auto mt-6 max-w-md">
              <EmailCapture
                source={`launch-${campus.slug}`}
                interests={[campus.slug]}
                placeholder="Your email"
                ctaText="Notify me"
                successMessage="You're on the list. We'll be in touch."
                variant="paper"
              />
            </div>
          </div>
        </section>
      )}

      {!isLaunching && !isOnline && (
        <section className="px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p
              className="font-sans"
              style={{
                color: "#534D44",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Your first Sunday
            </p>
            <h2
              className="mt-3 max-w-[22ch] font-display"
              style={{
                color: "#1C1A17",
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                lineHeight: 1.05,
                fontWeight: 300,
              }}
            >
              What to expect at {campus.name}.
            </h2>

            {showDraftRibbon && (
              <div
                className="mt-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                style={{
                  background: "rgba(253,251,246,0.9)",
                  border: `1px dashed ${tone}`,
                  color: tone,
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: tone }}
                />
                <span
                  className="font-sans"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Draft · pending {pastorFirstNames}&rsquo;s review
                </span>
              </div>
            )}

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
              {/* Left — the pastor's own paragraph, or a visible pending note */}
              <div>
                {voice.whatToExpect ? (
                  <EditableText
                    campusSlug={slug}
                    sectionKey="story"
                    fieldKey="story_long"
                    value={voice.whatToExpect}
                    multiline
                    maxLength={1500}
                    className="font-display"
                    style={{
                      color: "#1C1A17",
                      fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)",
                      lineHeight: 1.45,
                      fontWeight: 300,
                    }}
                  />
                ) : (
                  <PendingNote
                    label="What to expect"
                    heading={`A note from ${pastorFirstNames}, coming soon.`}
                    prompt={`60-word paragraph in ${pastorFirstNames}'s voice — what a Sunday at ${campus.name} actually feels like.`}
                    tone={tone}
                  />
                )}

                {voice.firstTimeLine && (
                  <EditableText
                    campusSlug={slug}
                    sectionKey="story"
                    fieldKey="story_short"
                    value={voice.firstTimeLine}
                    multiline={false}
                    maxLength={200}
                    className="mt-6 font-sans italic block"
                    style={{ color: "#534D44", fontSize: 15, lineHeight: 1.6 }}
                  />
                )}
              </div>

              {/* Right — the two or three specifics no other campus could claim */}
              <div>
                <p
                  className="font-sans"
                  style={{
                    color: tone,
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Only at {campus.name}
                </p>
                {voice.specifics && voice.specifics.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {voice.specifics.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2.5 inline-block h-1 w-3 flex-shrink-0 rounded-full"
                          style={{ background: tone }}
                        />
                        <span
                          className="font-sans"
                          style={{ color: "#1C1A17", fontSize: 15, lineHeight: 1.55 }}
                        >
                          {s}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-4">
                    <PendingNote
                      label="Specifics"
                      heading="Two or three things that are uniquely us."
                      prompt={`Two or three specifics no other campus could claim — e.g. coffee van, language, the walk up the hill, an after-service tradition at ${campus.name}.`}
                      tone={tone}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Kids at this campus — per-campus specifics (check-in, age groups, energy) */}
      {!isLaunching && !isOnline && (
        <section className="px-6 pb-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
              <div>
                <p
                  className="font-sans"
                  style={{
                    color: "#534D44",
                    fontSize: 11,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  Kids · {campus.name}
                </p>
                <h3
                  className="mt-3 font-display"
                  style={{
                    color: "#1C1A17",
                    fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                    lineHeight: 1.1,
                    fontWeight: 300,
                  }}
                >
                  Bring the kids. They&rsquo;ll love it.
                </h3>
              </div>
              <div>
                {voice.kidsBlock ? (
                  <EditableText
                    campusSlug={slug}
                    sectionKey="kids"
                    fieldKey="kids_overview"
                    value={voice.kidsBlock}
                    multiline
                    maxLength={800}
                    className="font-sans"
                    style={{ color: "#1C1A17", fontSize: 16, lineHeight: 1.7 }}
                  />
                ) : (
                  <PendingNote
                    label="Kids ministry"
                    heading={`A parent\u2019s-eye view of Sunday at ${campus.name}.`}
                    prompt={`Under 80 words — what check-in looks like, age groups, and the energy of the kids rooms at ${campus.name}.`}
                    tone={tone}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* From the pastor — first-person bio, voice not résumé */}
      {!isLaunching && !isOnline && campus.leadPastors && (
        <section className="px-6 pb-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <p
              className="font-sans"
              style={{
                color: "#534D44",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              From {pastorFirstNames}
            </p>
            {voice.pastorBio ? (
              <EditableText
                campusSlug={slug}
                sectionKey="pastors"
                fieldKey="pastor_bio_long"
                value={voice.pastorBio}
                multiline
                maxLength={1500}
                className="mt-4 font-display block"
                style={{
                  color: "#1C1A17",
                  fontSize: "clamp(1.25rem, 1.9vw, 1.65rem)",
                  lineHeight: 1.5,
                  fontWeight: 300,
                }}
              />
            ) : (
              <div className="mt-4">
                <PendingNote
                  label="Pastor bio"
                  heading={`One paragraph in ${pastorFirstNames}\u2019s own voice.`}
                  prompt={`~80 words in first-person — where ${pastorFirstNames} grew up, how they ended up at ${campus.name}, what they love about this room on a Sunday.`}
                  tone={tone}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {campus.lat && campus.lng && !isOnline && (
        <section className="px-6 py-14 sm:px-10 lg:px-16">
          <div
            className="mx-auto max-w-5xl rounded-[22px] p-8 sm:p-10"
            style={{
              background: "#FFFDF8",
              border: "1px solid rgba(28,26,23,0.08)",
            }}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: tone }} strokeWidth={1.8} />
                  <p
                    className="font-sans"
                    style={{
                      color: "#534D44",
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                    }}
                  >
                    Where we meet
                  </p>
                </div>
                <p className="mt-3 font-display italic" style={{ color: "#1C1A17", fontSize: 24, fontWeight: 300 }}>
                  {campus.address ?? campus.city}
                </p>
                <p className="mt-1 font-sans" style={{ color: "#534D44", fontSize: 13 }}>
                  {campus.lat.toFixed(4)}°, {campus.lng.toFixed(4)}°
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${campus.lat},${campus.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${tone}`,
                  color: "#1C1A17",
                  fontSize: 14,
                }}
              >
                Open in Maps →
              </a>
            </div>
          </div>
        </section>
      )}

      {!isLaunching && !isOnline && gallery.length > 0 && (
        <section className="px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-baseline gap-3">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: tone }}
              />
              <p
                className="font-sans"
                style={{
                  color: "#534D44",
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                Through the lens · {campus.name}
              </p>
            </div>
            <h2
              className="mt-3 max-w-[24ch] font-display"
              style={{
                color: "#1C1A17",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.05,
                fontWeight: 300,
              }}
            >
              Real Sundays, real people.
            </h2>

            <div
              className="mt-10 grid grid-cols-12 gap-3 sm:gap-4"
              style={{ gridAutoRows: "clamp(130px, 13vw, 200px)" }}
            >
              {gallery.slice(0, 8).map((src, i) => {
                // Asymmetric layout — 8-tile pattern: 1 tall left, then a 3-up
                // row, then 2 wide, then a final 2-up row.
                const layout = [
                  "col-span-6 sm:col-span-5 row-span-2", // 0 tall
                  "col-span-6 sm:col-span-4",            // 1
                  "col-span-6 sm:col-span-3",            // 2
                  "col-span-6 sm:col-span-4",            // 3
                  "col-span-6 sm:col-span-7",            // 4 wide
                  "col-span-6 sm:col-span-5",            // 5
                  "col-span-6 sm:col-span-6",            // 6
                  "col-span-6 sm:col-span-6",            // 7
                ];
                return (
                  <figure
                    key={src}
                    className={`group relative overflow-hidden rounded-[14px] ${layout[i] ?? "col-span-6 sm:col-span-4"}`}
                    style={{
                      background: "#E8DFD3",
                      boxShadow: "0 14px 32px -22px rgba(20,20,20,0.35)",
                    }}
                  >
                    <Image
                      src={src}
                      alt={`${campus.name} — Futures ${campus.city}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                      unoptimized
                      loading="lazy"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 mix-blend-soft-light"
                      style={{ background: tone, opacity: 0.12 }}
                    />
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {!isLaunching && comingUp.length > 0 && (
        <ComingUpRail events={comingUp.slice(0, 6)} tone={tone} campusName={campus.name} />
      )}

      <CampusAIPanel
        campusName={campus.name}
        city={campus.city}
        leadPastors={campus.leadPastors}
        isLaunching={isLaunching}
        isOnline={isOnline}
        brand={campus.brand}
        spanish={campus.spanish}
      />

      {!isLaunching && !isOnline && (
        <section className="px-6 py-16 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <ValueExchangeForm
              offer={`Get a text from the ${campus.city} team the day before you visit.`}
              proofPoints={[
                "A real pastor, not a bot",
                "They'll save you a seat",
                "Unsubscribe any time",
              ]}
              fields={["email", "phone"]}
              cta={`Save my seat at ${campus.name}`}
              outcome={
                campus.leadPastors
                  ? `${campus.leadPastors.split(" & ")[0]} will text you on Saturday.`
                  : `The ${campus.city} team will text you on Saturday.`
              }
              source={`campus-visit-${campus.slug}`}
            />
            <div>
              <p
                className="font-sans"
                style={{
                  color: "#534D44",
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                More at {campus.name}
              </p>
              <h3
                className="mt-3 font-display"
                style={{
                  color: "#1C1A17",
                  fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                  lineHeight: 1.1,
                  fontWeight: 300,
                }}
              >
                One campus, one family, lots of ways in.
              </h3>
              <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {[
                  { href: `/plan-a-visit?campus=${campus.slug}`, label: "Plan a visit" },
                  { href: `/watch?campus=${campus.slug}`, label: `Watch sermons from ${campus.name}` },
                  { href: `/leaders#${campus.slug}`, label: `Meet the ${campus.name} pastors` },
                  { href: `/kids#campus-${campus.slug}`, label: `Kids at ${campus.name}` },
                  { href: `/dreamers#campus-${campus.slug}`, label: `Dreamers at ${campus.name}` },
                  { href: `/women#campus-${campus.slug}`, label: `bU Women at ${campus.name}` },
                  { href: `/give?campus=${campus.slug}&designation=tithe`, label: `Give to ${campus.name}` },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between rounded-2xl px-4 py-3 font-sans transition-colors hover:bg-[#FFFDF8]"
                      style={{
                        border: "1px solid rgba(28,26,23,0.08)",
                        color: "#1C1A17",
                        fontSize: 14,
                      }}
                    >
                      <span>{link.label}</span>
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        style={{ color: tone }}
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {(isLaunching || isOnline) && (
        <section className="px-6 pb-16 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <p
              className="font-sans"
              style={{
                color: "#534D44",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Still part of the family
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[
                { href: `/watch?campus=${campus.slug}`, label: "Watch a service" },
                { href: `/leaders`, label: "Meet our pastors" },
                { href: `/give?campus=${campus.slug}`, label: `Give to ${campus.name}` },
                { href: `/plan-a-visit?campus=${campus.slug}`, label: "Visit another Futures campus" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between rounded-2xl px-4 py-3 font-sans transition-colors hover:bg-[#FFFDF8]"
                    style={{
                      border: "1px solid rgba(28,26,23,0.08)",
                      color: "#1C1A17",
                      fontSize: 14,
                    }}
                  >
                    <span>{link.label}</span>
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                      style={{ color: tone }}
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-baseline gap-3">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: tone }}
              />
              <p
                className="font-sans"
                style={{
                  color: "#534D44",
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                More in {REGION_LABEL[campus.region]}
              </p>
            </div>
            <h2
              className="mt-3 font-display"
              style={{
                color: "#1C1A17",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.05,
                fontWeight: 300,
              }}
            >
              Sister campuses, one family.
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {nearby.map((c) => {
                const p = CAMPUS_PHOTOS[c.slug];
                const launching = c.status === "launching";
                return (
                  <Link
                    key={c.slug}
                    href={`/campuses/${c.slug}`}
                    className="group block overflow-hidden rounded-[18px]"
                    style={{
                      background: tone,
                      boxShadow: "0 16px 36px -18px rgba(20,20,20,0.24)",
                      opacity: launching ? 0.82 : 1,
                    }}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {p && (
                        <Image
                          src={p}
                          alt={`${c.name} — ${c.city}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          unoptimized
                        />
                      )}
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{ background: tone, mixBlendMode: "soft-light", opacity: 0.32 }}
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 40%, rgba(28,26,23,0.72) 100%)",
                        }}
                      />
                      <div className="absolute bottom-4 left-4 right-4 text-[#FDFBF6]">
                        <p
                          className="font-sans"
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            opacity: 0.8,
                          }}
                        >
                          {c.city}
                        </p>
                        <p className="mt-1 font-display italic" style={{ fontSize: 20, fontWeight: 300 }}>
                          {c.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <Link
            href="/campuses"
            scroll={false}
            className="group inline-flex items-center gap-2 font-sans"
            style={{ color: "#534D44", fontSize: 13 }}
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={2}
            />
            <span>Back to all campuses</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
