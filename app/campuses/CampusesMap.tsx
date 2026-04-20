"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { campuses, type CampusRegion } from "@/lib/content/campuses";

const REGIONS: { key: CampusRegion; label: string; tone: string }[] = [
  { key: "australia", label: "Australia", tone: "#C8906B" },
  { key: "usa", label: "United States", tone: "#AC9B25" },
  { key: "indonesia", label: "Indonesia", tone: "#C45236" },
  { key: "south-america", label: "South America \u00b7 launching", tone: "#8A5A3C" },
  { key: "global", label: "Online", tone: "#D9B089" },
];

// City photo library — real Futures photography, resized & served from /public/photos.
// One curated hero per campus. Indonesian campuses without dedicated coverage reuse
// the Cemani/Solo pool; Venezuelan launching campuses reuse the Futuros pool.
export const CAMPUS_PHOTOS: Record<string, string> = {
  // Australia — South Australia
  paradise:         "/photos/campuses/paradise.jpg",
  "adelaide-city":  "/photos/campuses/city_1.jpg",
  south:            "/photos/campuses/south.jpg",
  "clare-valley":   "/photos/campuses/clare.jpg",
  salisbury:        "/photos/campuses/salisbury.jpg",
  "mount-barker":   "/photos/campuses/mtbarker.jpg",
  "victor-harbor":  "/photos/campuses/victorharbor.jpg",
  "copper-coast":   "/photos/campuses/kadina.jpg", // Kadina = Copper Coast

  // Online — use a warm lifestyle hero shot
  online:           "/photos/campuses/city_2.jpg",

  // USA — Futures English (Atlanta metro + Nashville)
  gwinnett:         "/photos/campuses/gwinnett.jpg",
  kennesaw:         "/photos/campuses/kennesaw.jpg",
  alpharetta:       "/photos/campuses/alpharetta.jpg",
  franklin:         "/photos/campuses/franklin.jpg",

  // Indonesia — Cemani + Solo have dedicated folders; others pull from the pool
  cemani:           "/photos/campuses/cemani.jpg",
  solo:             "/photos/campuses/solo.jpg",
  samarinda:        "/photos/campuses/cemani_2.jpg",
  langowan:         "/photos/campuses/cemani_3.jpg",
  bali:             "/photos/campuses/solo_2.jpg",

  // Futuros — Spanish-speaking (USA + Venezuela)
  "futuros-duluth":       "/photos/campuses/futuros.jpg",
  "futuros-kennesaw":     "/photos/campuses/futuros_2.jpg",
  "futuros-grayson":      "/photos/campuses/futuros_3.jpg",
  "futuros-caracas":      "/photos/campuses/futuros_4.jpg",
  "futuros-maracaibo":    "/photos/campuses/futuros_5.jpg",
  "futuros-valencia":     "/photos/campuses/futuros_6.jpg",
  "futuros-barquisimeto": "/photos/campuses/futuros_7.jpg",
};

// Gallery: ordered list of supplementary photos for a campus detail page.
// Excludes the hero already shown via CAMPUS_PHOTOS. Up to 8 images per slug.
// Slugs without dedicated folders borrow from their regional pool.
export const CAMPUS_GALLERY: Record<string, string[]> = {
  // Australia
  paradise: [
    "/photos/campuses/paradise_2.jpg",
    "/photos/campuses/paradise_3.jpg",
    "/photos/campuses/paradise_4.jpg",
    "/photos/campuses/paradise_5.jpg",
    "/photos/campuses/paradise_6.jpg",
    "/photos/campuses/paradise_7.jpg",
    "/photos/campuses/paradise_8.jpg",
    "/photos/campuses/paradise_9.jpg",
  ],
  "adelaide-city": [
    "/photos/campuses/city_2.jpg",
    "/photos/campuses/city_3.jpg",
    "/photos/campuses/city_4.jpg",
    "/photos/campuses/city_5.jpg",
  ],
  south: [
    "/photos/campuses/south_2.jpg",
    "/photos/campuses/south_3.jpg",
    "/photos/campuses/south_4.jpg",
    "/photos/campuses/south_5.jpg",
    "/photos/campuses/south_6.jpg",
    "/photos/campuses/south_7.jpg",
    "/photos/campuses/south_8.jpg",
    "/photos/campuses/south_9.jpg",
  ],
  "clare-valley": [
    "/photos/campuses/clare_2.jpg",
    "/photos/campuses/clare_3.jpg",
    "/photos/campuses/clare_4.jpg",
    "/photos/campuses/clare_5.jpg",
    "/photos/campuses/clare_6.jpg",
    "/photos/campuses/clare_7.jpg",
  ],
  salisbury: [
    "/photos/campuses/salisbury_2.jpg",
    "/photos/campuses/salisbury_3.jpg",
    "/photos/campuses/salisbury_4.jpg",
    "/photos/campuses/salisbury_5.jpg",
    "/photos/campuses/salisbury_6.jpg",
    "/photos/campuses/salisbury_7.jpg",
  ],
  "mount-barker": [
    "/photos/campuses/mtbarker_2.jpg",
    "/photos/campuses/mtbarker_3.jpg",
    "/photos/campuses/mtbarker_4.jpg",
    "/photos/campuses/mtbarker_5.jpg",
    "/photos/campuses/mtbarker_6.jpg",
    "/photos/campuses/mtbarker_7.jpg",
    "/photos/campuses/mtbarker_8.jpg",
    "/photos/campuses/mtbarker_9.jpg",
  ],
  "victor-harbor": [
    "/photos/campuses/victorharbor_2.jpg",
    "/photos/campuses/victorharbor_3.jpg",
    "/photos/campuses/victorharbor_4.jpg",
    "/photos/campuses/victorharbor_5.jpg",
    "/photos/campuses/victorharbor_6.jpg",
    "/photos/campuses/victorharbor_7.jpg",
  ],
  "copper-coast": [
    "/photos/campuses/kadina_2.jpg",
    "/photos/campuses/kadina_3.jpg",
    "/photos/campuses/kadina_4.jpg",
    "/photos/campuses/kadina_5.jpg",
    "/photos/campuses/kadina_6.jpg",
    "/photos/campuses/kadina_7.jpg",
    "/photos/campuses/kadina_8.jpg",
    "/photos/campuses/kadina_9.jpg",
  ],
  // USA
  gwinnett: [
    "/photos/campuses/gwinnett_2.jpg",
    "/photos/campuses/gwinnett_3.jpg",
    "/photos/campuses/gwinnett_4.jpg",
    "/photos/campuses/gwinnett_5.jpg",
    "/photos/campuses/gwinnett_6.jpg",
  ],
  kennesaw: [
    "/photos/campuses/kennesaw_2.jpg",
    "/photos/campuses/kennesaw_3.jpg",
    "/photos/campuses/kennesaw_4.jpg",
    "/photos/campuses/kennesaw_5.jpg",
  ],
  alpharetta: [
    "/photos/campuses/alpharetta_2.jpg",
    "/photos/campuses/alpharetta_3.jpg",
    "/photos/campuses/alpharetta_4.jpg",
    "/photos/campuses/alpharetta_5.jpg",
    "/photos/campuses/alpharetta_6.jpg",
    "/photos/campuses/alpharetta_7.jpg",
  ],
  franklin: [
    "/photos/campuses/franklin_2.jpg",
    "/photos/campuses/franklin_3.jpg",
    "/photos/campuses/franklin_4.jpg",
    "/photos/campuses/franklin_5.jpg",
    "/photos/campuses/franklin_6.jpg",
    "/photos/campuses/franklin_7.jpg",
    "/photos/campuses/franklin_8.jpg",
    "/photos/campuses/franklin_9.jpg",
  ],
  // Indonesia
  cemani: [
    "/photos/campuses/cemani_2.jpg",
    "/photos/campuses/cemani_3.jpg",
    "/photos/campuses/cemani_4.jpg",
    "/photos/campuses/cemani_5.jpg",
    "/photos/campuses/cemani_6.jpg",
    "/photos/campuses/cemani_7.jpg",
  ],
  solo: [
    "/photos/campuses/solo_2.jpg",
    "/photos/campuses/solo_3.jpg",
    "/photos/campuses/solo_4.jpg",
    "/photos/campuses/solo_5.jpg",
    "/photos/campuses/solo_6.jpg",
    "/photos/campuses/solo_7.jpg",
  ],
  samarinda: [
    "/photos/campuses/cemani_3.jpg",
    "/photos/campuses/cemani_4.jpg",
    "/photos/campuses/cemani_5.jpg",
    "/photos/campuses/cemani_6.jpg",
  ],
  langowan: [
    "/photos/campuses/cemani_4.jpg",
    "/photos/campuses/cemani_5.jpg",
    "/photos/campuses/cemani_6.jpg",
    "/photos/campuses/cemani_7.jpg",
  ],
  bali: [
    "/photos/campuses/solo_3.jpg",
    "/photos/campuses/solo_4.jpg",
    "/photos/campuses/solo_5.jpg",
    "/photos/campuses/solo_6.jpg",
  ],
  // Futuros
  "futuros-duluth": [
    "/photos/campuses/futuros_2.jpg",
    "/photos/campuses/futuros_3.jpg",
    "/photos/campuses/futuros_4.jpg",
    "/photos/campuses/futuros_5.jpg",
    "/photos/campuses/futuros_6.jpg",
    "/photos/campuses/futuros_7.jpg",
    "/photos/campuses/futuros_8.jpg",
    "/photos/campuses/futuros_9.jpg",
  ],
  "futuros-kennesaw": [
    "/photos/campuses/futuros_3.jpg",
    "/photos/campuses/futuros_4.jpg",
    "/photos/campuses/futuros_5.jpg",
    "/photos/campuses/futuros_6.jpg",
  ],
  "futuros-grayson": [
    "/photos/campuses/futuros_4.jpg",
    "/photos/campuses/futuros_5.jpg",
    "/photos/campuses/futuros_6.jpg",
    "/photos/campuses/futuros_7.jpg",
  ],
  "futuros-caracas": [
    "/photos/campuses/futuros_5.jpg",
    "/photos/campuses/futuros_6.jpg",
    "/photos/campuses/futuros_7.jpg",
    "/photos/campuses/futuros_8.jpg",
  ],
  "futuros-maracaibo": [
    "/photos/campuses/futuros_6.jpg",
    "/photos/campuses/futuros_7.jpg",
    "/photos/campuses/futuros_8.jpg",
    "/photos/campuses/futuros_9.jpg",
  ],
  "futuros-valencia": [
    "/photos/campuses/futuros_7.jpg",
    "/photos/campuses/futuros_8.jpg",
    "/photos/campuses/futuros_9.jpg",
    "/photos/campuses/futuros_10.jpg",
  ],
  "futuros-barquisimeto": [
    "/photos/campuses/futuros_8.jpg",
    "/photos/campuses/futuros_9.jpg",
    "/photos/campuses/futuros_10.jpg",
    "/photos/campuses/futuros_2.jpg",
  ],
};

export function CampusesMap() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return campuses;
    return campuses.filter((c) =>
      [c.name, c.city, c.country, c.leadPastors ?? ""].some((f) => f.toLowerCase().includes(normalized))
    );
  }, [normalized]);

  const totalMatches = filtered.length;

  return (
    <section
      id="tour"
      className="relative overflow-hidden py-32 sm:py-40"
      style={{ background: "#FDFBF6" }}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-[50ch]"
        >
          <p
            className="font-sans"
            style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            21 Campuses &middot; 4 Nations &middot; Venezuela Coming Soon
          </p>
          <h2
            className="mt-4 font-display"
            style={{ color: "#1C1A17", fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", lineHeight: 1.05, fontWeight: 300 }}
          >
            Twenty-one campuses. Four countries. One family.
          </h2>
          <p className="mt-5 font-sans" style={{ color: "#534D44", fontSize: 17, lineHeight: 1.6 }}>
            Every campus is a local church with its own pastors, its own city, its own story — all part of one Futures family. Find the one that&rsquo;s closest. Or the one that&rsquo;s calling.
          </p>
        </motion.div>

        {/* Search — find-by-city/ZIP, highest-utility addition on the page */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 max-w-[520px]"
        >
          <label
            htmlFor="campus-search"
            className="relative flex items-center gap-3 rounded-full px-5"
            style={{
              height: 60,
              background: "rgba(255,255,255,0.85)",
              border: "1.5px solid #E8DFD3",
              boxShadow: "0 1px 0 rgba(255,255,255,0.8) inset",
            }}
          >
            <Search className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.75} style={{ color: "#8A8178" }} />
            <input
              id="campus-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="find by city or campus name"
              aria-label="Find a campus by city or name"
              className="flex-1 bg-transparent font-display italic outline-none"
              style={{ color: "#1C1A17", fontSize: 16 }}
            />
            {query && (
              <span className="font-sans" style={{ color: "#8A8178", fontSize: 12 }}>
                {totalMatches} {totalMatches === 1 ? "match" : "matches"}
              </span>
            )}
          </label>
        </motion.div>

        <div className="mt-10 space-y-14">
          {totalMatches === 0 && (
            <p className="font-display italic" style={{ color: "#534D44", fontSize: 18 }}>
              Nothing matched &ldquo;{query}&rdquo; — try a city, a country, or ask Ezra above.
            </p>
          )}
          {REGIONS.map((r) => {
            const list = filtered.filter((c) => c.region === r.key);
            if (!list.length) return null;
            return (
              <motion.div
                key={r.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="mb-5 flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: r.tone }}
                  />
                  <h3
                    className="font-display italic"
                    style={{ color: "#1C1A17", fontSize: 22, fontWeight: 300 }}
                  >
                    {r.label}
                  </h3>
                  <span className="font-sans" style={{ color: "#8A8178", fontSize: 13 }}>
                    {list.length} {list.length === 1 ? "campus" : "campuses"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {list.map((c) => {
                    const launching = c.status === "launching";
                    const photo = CAMPUS_PHOTOS[c.slug];
                    return (
                      <Link
                        key={c.slug}
                        href={`/campuses/${c.slug}`}
                        className="group relative block overflow-hidden rounded-[18px] transition-all duration-500"
                        style={{
                          background: r.tone,
                          border: "1px solid rgba(20,20,20,0.08)",
                          boxShadow: "0 14px 32px -20px rgba(20,20,20,0.3)",
                          opacity: launching ? 0.88 : 1,
                          aspectRatio: "4 / 5",
                        }}
                      >
                        {/* City photo — Ken-Burns on hover */}
                        {photo && (
                          <div className="absolute inset-0 overflow-hidden">
                            <Image
                              src={photo}
                              alt={`${c.name} — ${c.city}`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                              className="object-cover transition-all duration-[900ms] ease-out group-hover:scale-110"
                              unoptimized
                            />
                            {/* Region tone wash — keeps family cohesion across photo sources */}
                            <div
                              aria-hidden
                              className="absolute inset-0 mix-blend-soft-light"
                              style={{ background: r.tone, opacity: 0.22 }}
                            />
                            {/* Bottom ink gradient for text legibility — photo stays visible */}
                            <div
                              aria-hidden
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(28,26,23,0) 40%, rgba(28,26,23,0.35) 65%, rgba(28,26,23,0.85) 100%)",
                              }}
                            />
                          </div>
                        )}

                        {/* Shimmer sweep on hover */}
                        <span
                          aria-hidden
                          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                        />

                        <div className="absolute inset-0 flex flex-col justify-end p-5">
                          <div className="relative">
                            <p
                              className="font-display"
                              style={{ color: "#FDFBF6", fontSize: 22, fontWeight: 300, lineHeight: 1.12, textShadow: "0 2px 10px rgba(0,0,0,0.35)" }}
                            >
                              {c.name}
                            </p>
                            <p
                              className="mt-1 flex items-center gap-1.5 font-sans"
                              style={{ color: "rgba(253,251,246,0.85)", fontSize: 13 }}
                            >
                              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                              {c.city}
                            </p>
                            {c.leadPastors && (
                              <p
                                className="mt-2 font-display italic"
                                style={{ color: "rgba(253,251,246,0.75)", fontSize: 13 }}
                              >
                                {c.leadPastors}
                              </p>
                            )}
                            {launching && (
                              <p
                                className="mt-2 font-display italic"
                                style={{ color: "#F2E6D1", fontSize: 13 }}
                              >
                                coming soon &middot; 2026
                              </p>
                            )}
                            <span
                              className="mt-3 inline-flex items-center gap-1 font-sans opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                              style={{
                                color: r.tone,
                                fontSize: 11,
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                              }}
                            >
                              Visit campus
                              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </span>
                          </div>
                          {c.status === "online" && (
                            <span
                              className="absolute top-5 right-5 rounded-full px-2 py-0.5 font-sans"
                              style={{
                                background: "rgba(172,155,37,0.35)",
                                color: "#3F3A10",
                                fontSize: 10,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                              }}
                            >
                              Anywhere
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
