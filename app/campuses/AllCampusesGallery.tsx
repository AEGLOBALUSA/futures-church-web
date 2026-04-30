"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { campuses, type Campus } from "@/lib/content/campuses";
import { CAMPUS_PHOTOS, PASTOR_PHOTOS } from "./CampusesMap";

// All-campuses gallery — every campus on one page, in one beautiful grid.
// Each card shows the venue photo, the city, service time, and (where known)
// the lead pastors with a small portrait. Grouped by region; the country
// header is sticky-soft and lets the eye travel rather than collapse.
//
// Click a card → /campuses/[slug] for the full campus page.

const REGION_ORDER: Array<{
  key: Campus["region"];
  label: string;
  subtitle: string;
  tone: string;
}> = [
  { key: "australia",      label: "Australia",      subtitle: "Where the family started — 8 campuses across South Australia + online.", tone: "#C8906B" },
  { key: "usa",            label: "United States",  subtitle: "Atlanta metro, Nashville, plus the Spanish-speaking Futuros family.",     tone: "#AC9B25" },
  { key: "indonesia",      label: "Indonesia",      subtitle: "Five campuses across Java, Bali, Kalimantan and Sulawesi.",                tone: "#C45236" },
  { key: "south-america",  label: "South America",  subtitle: "Four Futuros campuses launching late 2026 across Venezuela.",              tone: "#8A5A3C" },
  { key: "global",         label: "Online",         subtitle: "Anywhere there's a wifi connection, there's a seat at the table.",        tone: "#D9B089" },
];

function PastorBadge({ slug, pastors }: { slug: string; pastors?: string }) {
  const portrait = PASTOR_PHOTOS[slug];
  if (!pastors && !portrait) return null;
  return (
    <div className="flex items-center gap-2.5">
      {portrait && (
        <div
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
          style={{ border: "2px solid rgba(253,251,246,0.85)" }}
        >
          <Image
            src={portrait}
            alt={pastors ? `${pastors} — pastors` : "Lead pastors"}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      )}
      {pastors && (
        <p
          className="font-sans text-[12.5px]"
          style={{ color: "#FDFBF6", lineHeight: 1.25, letterSpacing: "0.01em" }}
        >
          <span className="opacity-70">Pastored by</span>
          <br />
          <span className="font-medium">{pastors}</span>
        </p>
      )}
    </div>
  );
}

function CampusCard({ campus, i }: { campus: Campus; i: number }) {
  const reduceMotion = useReducedMotion();
  const photo = CAMPUS_PHOTOS[campus.slug] ?? "/photos/campuses/city_1.jpg";
  const isLaunching = campus.status === "launching";
  const isOnline = campus.status === "online";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <Link
        href={isOnline ? "/watch" : `/campuses/${campus.slug}`}
        className="block overflow-hidden rounded-[20px]"
        style={{
          boxShadow: "0 18px 38px -22px rgba(20,20,20,0.4)",
          background: "#1C1A17",
        }}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={photo}
            alt={`${campus.name} — ${campus.city}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />

          {/* Warm wash for cohesion */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-soft-light"
            style={{ background: "#D9B089", opacity: 0.16 }}
          />

          {/* Bottom gradient for legibility */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[62%]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(20,18,15,0.45) 45%, rgba(20,18,15,0.85) 100%)",
            }}
          />

          {/* Status pill */}
          {(isLaunching || isOnline || campus.brand === "futuros") && (
            <span
              className="absolute right-4 top-4 rounded-full px-2.5 py-1 font-sans uppercase"
              style={{
                background: "rgba(253,251,246,0.92)",
                color: "#1C1A17",
                fontSize: 10,
                letterSpacing: "0.18em",
                fontWeight: 600,
              }}
            >
              {isLaunching ? "Launching" : isOnline ? "Online" : "Futuros"}
            </span>
          )}

          {/* Card body */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p
              className="font-sans uppercase"
              style={{
                color: "#FDFBF6",
                fontSize: 10,
                letterSpacing: "0.24em",
                opacity: 0.78,
              }}
            >
              {campus.country}
            </p>
            <h3
              className="mt-1 font-display"
              style={{
                color: "#FDFBF6",
                fontSize: "clamp(1.35rem, 1.8vw, 1.7rem)",
                lineHeight: 1.05,
                fontWeight: 400,
              }}
            >
              {campus.name}
            </h3>
            <p
              className="mt-1 font-sans"
              style={{ color: "#FDFBF6", fontSize: 12.5, opacity: 0.75 }}
            >
              {campus.city}
              {campus.serviceTime ? ` · ${campus.serviceTime.replace("Sundays · ", "")}` : ""}
            </p>

            {(PASTOR_PHOTOS[campus.slug] || campus.leadPastors) && (
              <div className="mt-4">
                <PastorBadge slug={campus.slug} pastors={campus.leadPastors} />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function AllCampusesGallery() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative py-28 sm:py-36"
      style={{ background: "#FDFBF6" }}
      id="all-campuses"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-[58ch] text-center"
        >
          <p
            className="font-sans"
            style={{
              color: "#1C1A17",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Every campus
          </p>
          <h2
            className="mt-4 font-display"
            style={{
              color: "#1C1A17",
              fontSize: "clamp(2.25rem, 4.8vw, 3.75rem)",
              lineHeight: 1.02,
              fontWeight: 300,
            }}
          >
            One family. <em className="italic">Twenty-five</em> cities.
          </h2>
          <p
            className="mt-5 font-sans"
            style={{ color: "#534D44", fontSize: 16.5, lineHeight: 1.65 }}
          >
            Each campus is its own house — its own pastors, its own
            neighbourhood, its own service times. But every door opens to the
            same family. Pick a city, meet the pastors, plan a Sunday.
          </p>
        </motion.div>

        {REGION_ORDER.map((region, regionIdx) => {
          const list = campuses.filter((c) => c.region === region.key);
          if (!list.length) return null;
          return (
            <div key={region.key} className="mt-20 first:mt-16">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col gap-2 border-b pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
                style={{ borderColor: "rgba(28,26,23,0.12)" }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: region.tone }}
                  />
                  <h3
                    className="font-display"
                    style={{
                      color: "#1C1A17",
                      fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                      lineHeight: 1.05,
                      fontWeight: 300,
                    }}
                  >
                    {region.label}
                  </h3>
                  <span
                    className="font-sans"
                    style={{
                      color: "#534D44",
                      fontSize: 13,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {list.length} {list.length === 1 ? "campus" : "campuses"}
                  </span>
                </div>
                <p
                  className="max-w-[44ch] font-sans"
                  style={{ color: "#534D44", fontSize: 14, lineHeight: 1.5 }}
                >
                  {region.subtitle}
                </p>
              </motion.div>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((campus, i) => (
                  <CampusCard key={campus.slug} campus={campus} i={i + regionIdx} />
                ))}
              </div>
            </div>
          );
        })}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-20 flex flex-col items-center gap-4 text-center"
        >
          <p
            className="font-display italic"
            style={{
              color: "#1C1A17",
              fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
              lineHeight: 1.45,
              fontWeight: 300,
            }}
          >
            Can't find your city? It's coming.
          </p>
          <Link
            href="/plan-a-visit"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-sans transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "#1C1A17",
              color: "#FDFBF6",
              fontSize: 14,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
              boxShadow: "0 14px 30px -14px rgba(20,20,20,0.4)",
            }}
          >
            Plan your first visit
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
