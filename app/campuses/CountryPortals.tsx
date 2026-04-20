"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { campuses } from "@/lib/content/campuses";
import { CAMPUS_PHOTOS } from "./CampusesMap";

// Countries, in the order Ashley asked for: USA, Australia, Venezuela, Indonesia, Brazil.
// Each portal is a doorway — country image, campus count, tone. Click → smooth-scroll
// to that country's section below, where the individual campuses live with photos.
type CountryKey = "usa" | "australia" | "venezuela" | "indonesia" | "brazil";

const COUNTRIES: {
  key: CountryKey;
  label: string;
  blurb: string;
  tone: string;
  // Hero image for the portal tile (large). Reuses already-verified Unsplash IDs
  // wherever possible, so we don't ship broken images.
  hero: string;
  // Which campuses belong under this portal. Uses the `country` field on Campus
  // (not `region`) so Venezuela and Brazil separate cleanly even though they
  // both live under the south-america region in the data model.
  campusFilter: (country: string, region: string) => boolean;
  status?: "active" | "launching" | "scouting";
  note?: string;
}[] = [
  {
    key: "australia",
    label: "Australia",
    blurb: "Eight campuses across South Australia.",
    tone: "#C8906B",
    hero: "/photos/countries/australia.jpg",
    campusFilter: (country) => country === "Australia",
    status: "active",
  },
  {
    key: "usa",
    label: "United States",
    blurb: "Georgia & Tennessee. English and Spanish (Futuros).",
    tone: "#AC9B25",
    hero: "/photos/countries/usa.jpg",
    campusFilter: (country) => country === "USA",
    status: "active",
  },
  {
    key: "venezuela",
    label: "Venezuela",
    blurb: "Four Futuros campuses launching in 2026.",
    tone: "#8A5A3C",
    hero: "/photos/countries/venezuela.jpg",
    campusFilter: (country) => country === "Venezuela",
    status: "launching",
    note: "Launching 2026",
  },
  {
    key: "indonesia",
    label: "Indonesia",
    blurb: "Java, Sulawesi, Kalimantan & Bali.",
    tone: "#C45236",
    hero: "/photos/countries/indonesia.jpg",
    campusFilter: (country) => country === "Indonesia",
    status: "active",
  },
  {
    key: "brazil",
    label: "Brazil",
    blurb: "A nation of 215 million. We are praying and preparing.",
    tone: "#4A7C59",
    // No campuses yet → use a warm AU hero shot with strong tint to stand for
    // the Brazilian green; will be replaced once photography from Brazil lands.
    hero: "/photos/countries/australia.jpg",
    campusFilter: () => false,
    status: "scouting",
    note: "Scouting lead pastors",
  },
];

export function CountryPortals() {
  const [hovered, setHovered] = useState<CountryKey | null>(null);

  function scrollToCountry(key: CountryKey) {
    const el = document.getElementById(`country-${key}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section
      id="tour"
      className="relative overflow-hidden py-28 sm:py-36"
      style={{ background: "#FDFBF6" }}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-[56ch]"
        >
          <p
            className="font-sans"
            style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            5 Nations &middot; 25 Campuses &middot; One Family
          </p>
          <h2
            className="mt-4 font-display"
            style={{ color: "#1C1A17", fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", lineHeight: 1.05, fontWeight: 300 }}
          >
            Choose your country.
          </h2>
          <p className="mt-5 font-sans" style={{ color: "#534D44", fontSize: 17, lineHeight: 1.6 }}>
            Every campus is a local church with its own pastors, its own city, its own story.
            Step through a country portal to meet the people there.
          </p>
        </motion.div>

        {/* 5 country portals — large tiles, cinematic */}
        <div
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          role="tablist"
          aria-label="Choose a country"
        >
          {COUNTRIES.map((c, i) => {
            const count = campuses.filter((x) => c.campusFilter(x.country, x.region)).length;
            const isHovered = hovered === c.key;
            return (
              <motion.button
                key={c.key}
                type="button"
                role="tab"
                onClick={() => scrollToCountry(c.key)}
                onMouseEnter={() => setHovered(c.key)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className="group relative overflow-hidden rounded-[22px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  aspectRatio: "3 / 4",
                  background: c.tone,
                  border: "1px solid rgba(20,20,20,0.08)",
                  boxShadow: isHovered
                    ? "0 28px 60px -24px rgba(20,20,20,0.45)"
                    : "0 18px 40px -24px rgba(20,20,20,0.3)",
                  transition: "box-shadow 600ms ease-out, transform 600ms ease-out",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* Country hero image */}
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={c.hero}
                    alt={`${c.label} — Futures Church`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
                    unoptimized
                    priority={i < 2}
                  />
                  {/* Country tone wash — soft-light keeps photo warm, unifies the row */}
                  <div
                    aria-hidden
                    className="absolute inset-0 mix-blend-soft-light"
                    style={{ background: c.tone, opacity: 0.3 }}
                  />
                  {/* Ink bottom gradient — text legibility, photo stays visible */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(28,26,23,0.1) 0%, rgba(28,26,23,0.3) 45%, rgba(28,26,23,0.72) 75%, rgba(28,26,23,0.95) 100%)",
                    }}
                  />
                </div>

                {/* Launching / scouting pill — top right */}
                {c.note && (
                  <span
                    className="absolute top-4 right-4 rounded-full px-2.5 py-1 font-sans"
                    style={{
                      background: "#FDFBF6",
                      color: c.tone,
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {c.note}
                  </span>
                )}

                {/* Content — bottom-anchored */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p
                    className="font-sans"
                    style={{
                      color: "#FDFBF6",
                      fontSize: 11,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    }}
                  >
                    {c.status === "scouting"
                      ? "Coming"
                      : `${count} ${count === 1 ? "Campus" : "Campuses"}`}
                  </p>
                  <h3
                    className="mt-2 font-display"
                    style={{
                      color: "#FDFBF6",
                      fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)",
                      fontWeight: 300,
                      lineHeight: 1.05,
                      textShadow: "0 2px 14px rgba(0,0,0,0.55)",
                    }}
                  >
                    {c.label}
                  </h3>
                  <p
                    className="mt-2 font-sans"
                    style={{
                      color: "#FDFBF6",
                      fontSize: 13,
                      lineHeight: 1.5,
                      textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                    }}
                  >
                    {c.blurb}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-1.5 font-sans"
                    style={{
                      color: "#FDFBF6",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                      opacity: isHovered ? 1 : 0.92,
                      transition: "opacity 400ms ease-out",
                    }}
                  >
                    {c.status === "scouting" ? "Pray with us" : "Enter"}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-500"
                      strokeWidth={1.75}
                      style={{ transform: isHovered ? "translateX(4px)" : "translateX(0)" }}
                    />
                  </span>
                </div>

                {/* Shimmer sweep on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full"
                />
              </motion.button>
            );
          })}
        </div>

        {/* Country-by-country campus sections */}
        <div className="mt-28 space-y-24">
          {COUNTRIES.map((c) => (
            <CountrySection key={c.key} country={c} />
          ))}
        </div>

        {/* Online — the sixth home. Not a country, but a campus nonetheless. */}
        <OnlineBand />
      </div>
    </section>
  );
}

function OnlineBand() {
  const online = campuses.find((c) => c.slug === "online");
  if (!online) return null;
  const photo = CAMPUS_PHOTOS[online.slug];
  const tone = "#D9B089";
  return (
    <motion.div
      id="country-online"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="scroll-mt-20 mt-24"
    >
      <Link
        href={`/campuses/${online.slug}`}
        className="group relative block overflow-hidden rounded-[24px]"
        style={{
          aspectRatio: "5 / 2",
          background: tone,
          border: "1px solid rgba(20,20,20,0.08)",
          boxShadow: "0 20px 48px -28px rgba(20,20,20,0.35)",
        }}
      >
        {photo && (
          <Image
            src={photo}
            alt="Futures Online — Anywhere in the world"
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
            unoptimized
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light"
          style={{ background: tone, opacity: 0.28 }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(28,26,23,0.85) 0%, rgba(28,26,23,0.55) 55%, rgba(28,26,23,0.2) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
          <p
            className="font-sans"
            style={{
              color: "#FDFBF6",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 500,
              textShadow: "0 1px 6px rgba(0,0,0,0.55)",
            }}
          >
            Online · Anywhere
          </p>
          <h3
            className="mt-3 font-display"
            style={{
              color: "#FDFBF6",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300,
              lineHeight: 1,
              textShadow: "0 2px 18px rgba(0,0,0,0.6)",
            }}
          >
            Futures Online — the sixth home.
          </h3>
          <p
            className="mt-3 max-w-[52ch] font-sans"
            style={{
              color: "#FDFBF6",
              fontSize: 16,
              lineHeight: 1.5,
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            One congregation, every time zone. Services stream live with real hosts,
            real prayer, and real pastors in the chat.
          </p>
          <span
            className="mt-5 inline-flex items-center gap-2 font-sans"
            style={{
              color: "#FDFBF6",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
              textShadow: "0 1px 6px rgba(0,0,0,0.55)",
            }}
          >
            Step inside
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.75}
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function CountrySection({
  country: c,
}: {
  country: (typeof COUNTRIES)[number];
}) {
  const list = useMemo(
    () => campuses.filter((x) => c.campusFilter(x.country, x.region)),
    [c]
  );

  return (
    <motion.div
      id={`country-${c.key}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="scroll-mt-20"
    >
      {/* Country band — image + headline + count */}
      <div
        className="relative overflow-hidden rounded-[24px]"
        style={{
          aspectRatio: "5 / 2",
          background: c.tone,
          border: "1px solid rgba(20,20,20,0.08)",
          boxShadow: "0 20px 48px -28px rgba(20,20,20,0.35)",
        }}
      >
        <Image
          src={c.hero}
          alt={`${c.label} — Futures Church`}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-cover"
          unoptimized
        />
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light"
          style={{ background: c.tone, opacity: 0.25 }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(28,26,23,0.82) 0%, rgba(28,26,23,0.5) 55%, rgba(28,26,23,0.18) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
          <p
            className="font-sans"
            style={{
              color: "#FDFBF6",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 500,
              textShadow: "0 1px 6px rgba(0,0,0,0.55)",
            }}
          >
            {c.status === "scouting"
              ? "Coming — Scouting lead pastors"
              : c.status === "launching"
              ? `Launching — ${list.length} ${list.length === 1 ? "campus" : "campuses"}`
              : `${list.length} ${list.length === 1 ? "campus" : "campuses"}`}
          </p>
          <h3
            className="mt-3 font-display"
            style={{
              color: "#FDFBF6",
              fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
              fontWeight: 300,
              lineHeight: 1,
              textShadow: "0 2px 18px rgba(0,0,0,0.6)",
            }}
          >
            {c.label}
          </h3>
          <p
            className="mt-3 max-w-[50ch] font-sans"
            style={{
              color: "#FDFBF6",
              fontSize: 16,
              lineHeight: 1.5,
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            {c.blurb}
          </p>
        </div>
      </div>

      {/* Campus tiles */}
      {list.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((campus) => {
            const launching = campus.status === "launching";
            const photo = CAMPUS_PHOTOS[campus.slug];
            return (
              <Link
                key={campus.slug}
                href={`/campuses/${campus.slug}`}
                className="group relative block overflow-hidden rounded-[18px] transition-all duration-500"
                style={{
                  background: c.tone,
                  border: "1px solid rgba(20,20,20,0.08)",
                  boxShadow: "0 14px 32px -20px rgba(20,20,20,0.3)",
                  opacity: launching ? 0.92 : 1,
                  aspectRatio: "4 / 5",
                }}
              >
                {photo && (
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={photo}
                      alt={`${campus.name} — ${campus.city}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-all duration-[900ms] ease-out group-hover:scale-110"
                      unoptimized
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 mix-blend-soft-light"
                      style={{ background: c.tone, opacity: 0.22 }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(28,26,23,0) 30%, rgba(28,26,23,0.55) 65%, rgba(28,26,23,0.95) 100%)",
                      }}
                    />
                  </div>
                )}
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p
                    className="font-display"
                    style={{
                      color: "#FDFBF6",
                      fontSize: 22,
                      fontWeight: 300,
                      lineHeight: 1.12,
                      textShadow: "0 2px 12px rgba(0,0,0,0.55)",
                    }}
                  >
                    {campus.name}
                  </p>
                  <p
                    className="mt-1 flex items-center gap-1.5 font-sans"
                    style={{
                      color: "#FDFBF6",
                      fontSize: 13,
                      textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                    }}
                  >
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {campus.city}
                  </p>
                  {campus.leadPastors && (
                    <p
                      className="mt-2 font-display italic"
                      style={{
                        color: "#FDFBF6",
                        fontSize: 13,
                        textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                      }}
                    >
                      {campus.leadPastors}
                    </p>
                  )}
                  {launching && (
                    <p
                      className="mt-2 font-display italic"
                      style={{ color: "#F2E6D1", fontSize: 13 }}
                    >
                      coming soon · 2026
                    </p>
                  )}
                  <span
                    className="mt-3 inline-flex items-center gap-1 font-sans opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      color: c.tone,
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                    }}
                  >
                    Visit campus
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        // Brazil (and any other pre-launch country): placeholder card
        <div
          className="mt-8 rounded-[18px] p-10 sm:p-14"
          style={{
            background: "linear-gradient(180deg, #F7F1E6 0%, #F2E6D1 100%)",
            border: "1px solid rgba(20,20,20,0.08)",
          }}
        >
          <p
            className="font-sans"
            style={{ color: c.tone, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600 }}
          >
            What&rsquo;s happening now
          </p>
          <h4
            className="mt-3 font-display"
            style={{ color: "#1C1A17", fontSize: "clamp(1.5rem, 2.6vw, 2rem)", fontWeight: 300, lineHeight: 1.15 }}
          >
            Praying. Scouting. Preparing.
          </h4>
          <p
            className="mt-4 max-w-[60ch] font-sans"
            style={{ color: "#534D44", fontSize: 16, lineHeight: 1.6 }}
          >
            Brazil is next on our heart. We are in conversation with pastors and leaders in São Paulo,
            Rio, and Brasília. Campuses will be announced here as leaders are commissioned.
            If you feel called to plant with us, we would love to meet you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: c.tone,
                color: "#FDFBF6",
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
                boxShadow: "0 10px 24px -12px rgba(74,124,89,0.5)",
              }}
            >
              Plant with us
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
            <Link
              href="/give"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "transparent",
                color: c.tone,
                border: `1.5px solid ${c.tone}`,
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Give toward Brazil
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
