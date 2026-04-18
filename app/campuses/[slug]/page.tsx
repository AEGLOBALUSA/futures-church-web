import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Instagram, Facebook } from "lucide-react";
import { campuses, type CampusRegion } from "@/lib/content/campuses";
import { CAMPUS_PHOTOS } from "../CampusesMap";
import { EmailCapture } from "@/components/ui/EmailCapture";

const REGION_LABEL: Record<CampusRegion, string> = {
  australia: "Australia",
  usa: "United States",
  indonesia: "Indonesia",
  venezuela: "Venezuela",
  global: "Online",
};

const REGION_TONE: Record<CampusRegion, string> = {
  australia: "#C8906B",
  usa: "#AC9B25",
  indonesia: "#C45236",
  venezuela: "#8A5A3C",
  global: "#D9B089",
};

const EXPECT_CARDS: { title: string; body: string }[] = [
  {
    title: "People",
    body: "You'll be greeted at the door — for real. No pressure, no awkwardness. Just people glad you're there.",
  },
  {
    title: "Worship",
    body: "Live, contemporary worship. Whether it's your first Sunday or your thousandth, the room makes space for you.",
  },
  {
    title: "Kids",
    body: "Safe, accredited kids ministry for every age. Your kids will love it — and you'll actually get to be present in the service.",
  },
];

export async function generateStaticParams() {
  return campuses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campus = campuses.find((c) => c.slug === slug);
  if (!campus) return {};
  return {
    title: `${campus.name} · Futures Church`,
    description: `Futures Church ${campus.name} — ${campus.city}. ${
      campus.status === "launching" ? "Launching soon." : "Join us this Sunday."
    }`,
    openGraph: {
      title: `${campus.name} · Futures Church`,
      description: `${campus.city} · ${REGION_LABEL[campus.region]}`,
      images: CAMPUS_PHOTOS[campus.slug] ? [CAMPUS_PHOTOS[campus.slug]] : undefined,
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
  const photo = CAMPUS_PHOTOS[campus.slug];
  const nearby = campuses
    .filter((c) => c.region === campus.region && c.slug !== campus.slug)
    .slice(0, 4);

  return (
    <main className="bg-[#FDFBF6] text-[#1C1A17] selection:bg-[#C8906B] selection:text-[#FDFBF6]">
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

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
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

              {campus.leadPastors && (
                <p
                  className="mt-6 font-sans"
                  style={{ color: "#534D44", fontSize: 16, lineHeight: 1.6 }}
                >
                  Led by{" "}
                  <span style={{ color: "#1C1A17" }}>{campus.leadPastors}</span>
                </p>
              )}

              {campus.address && (
                <div className="mt-3 flex items-center gap-2 font-sans" style={{ color: "#534D44", fontSize: 14 }}>
                  <MapPin className="h-4 w-4" style={{ color: tone }} strokeWidth={1.8} />
                  <span>{campus.address}, {campus.city}</span>
                </div>
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

                {campus.instagram && (
                  <a
                    href={campus.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                    style={{ border: "1px solid rgba(28,26,23,0.12)", color: "#534D44" }}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" strokeWidth={1.6} />
                  </a>
                )}
                {campus.facebook && (
                  <a
                    href={campus.facebook}
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

            {photo && (
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
            )}
          </div>
        </div>
      </section>

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

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {EXPECT_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[18px] p-7"
                  style={{
                    background: "#FFFDF8",
                    border: "1px solid rgba(28,26,23,0.08)",
                  }}
                >
                  <p className="font-display italic" style={{ color: tone, fontSize: 22, fontWeight: 300 }}>
                    {card.title}
                  </p>
                  <p className="mt-3 font-sans" style={{ color: "#534D44", fontSize: 14, lineHeight: 1.6 }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
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
