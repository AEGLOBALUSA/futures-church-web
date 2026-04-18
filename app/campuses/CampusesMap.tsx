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
  { key: "venezuela", label: "Venezuela · coming soon", tone: "#8A5A3C" },
  { key: "global", label: "Online", tone: "#D9B089" },
];

// City photo library — swap for real Futures photos as they land.
// Keyed by campus slug; fallback by region if missing.
export const CAMPUS_PHOTOS: Record<string, string> = {
  paradise: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200&q=75&auto=format&fit=crop",
  "adelaide-city": "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200&q=75&auto=format&fit=crop",
  south: "https://images.unsplash.com/photo-1541753236788-b0ac1fc5009d?w=1200&q=75&auto=format&fit=crop",
  "clare-valley": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=75&auto=format&fit=crop",
  salisbury: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=75&auto=format&fit=crop",
  "mount-barker": "https://images.unsplash.com/photo-1496564203457-11bb12075d90?w=1200&q=75&auto=format&fit=crop",
  "victor-harbor": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=75&auto=format&fit=crop",
  "copper-coast": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=75&auto=format&fit=crop",
  online: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&q=75&auto=format&fit=crop",
  gwinnett: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=75&auto=format&fit=crop",
  kennesaw: "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=1200&q=75&auto=format&fit=crop",
  alpharetta: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1200&q=75&auto=format&fit=crop",
  franklin: "https://images.unsplash.com/photo-1508515053963-70c7cc39dfb5?w=1200&q=75&auto=format&fit=crop",
  cemani: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=75&auto=format&fit=crop",
  solo: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=1200&q=75&auto=format&fit=crop",
  samarinda: "https://images.unsplash.com/photo-1601823984263-b87b59798b70?w=1200&q=75&auto=format&fit=crop",
  langowan: "https://images.unsplash.com/photo-1518181835702-6eef8b4b2113?w=1200&q=75&auto=format&fit=crop",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=75&auto=format&fit=crop",
  "futuros-duluth": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=75&auto=format&fit=crop",
  "futuros-kennesaw": "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=1200&q=75&auto=format&fit=crop",
  "futuros-grayson": "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1200&q=75&auto=format&fit=crop",
  "futuros-caracas": "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=1200&q=75&auto=format&fit=crop",
  "futuros-maracaibo": "https://images.unsplash.com/photo-1552960562-daf630e9278b?w=1200&q=75&auto=format&fit=crop",
  "futuros-valencia": "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=75&auto=format&fit=crop",
  "futuros-barquisimeto": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=75&auto=format&fit=crop",
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
              Nothing matched &ldquo;{query}&rdquo; — try a city, a country, or ask our guide above.
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
                          background: "rgba(255,255,255,0.72)",
                          border: "1px solid rgba(20,20,20,0.06)",
                          boxShadow: "0 1px 0 rgba(255,255,255,0.8) inset",
                          opacity: launching ? 0.65 : 1,
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
                              style={{
                                filter: "saturate(0.85) brightness(0.92)",
                              }}
                              unoptimized
                            />
                            <div
                              aria-hidden
                              className="absolute inset-0 mix-blend-soft-light transition-opacity duration-700"
                              style={{ background: r.tone, opacity: 0.35 }}
                            />
                            <div
                              aria-hidden
                              className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-60"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(253,251,246,0.1) 0%, rgba(253,251,246,0.5) 55%, rgba(253,251,246,0.92) 100%)",
                                opacity: 0.85,
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
                              style={{ color: "#1C1A17", fontSize: 22, fontWeight: 300, lineHeight: 1.12 }}
                            >
                              {c.name}
                            </p>
                            <p
                              className="mt-1 flex items-center gap-1.5 font-sans"
                              style={{ color: "#534D44", fontSize: 13 }}
                            >
                              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                              {c.city}
                            </p>
                            {c.leadPastors && (
                              <p
                                className="mt-2 font-display italic"
                                style={{ color: "#8A8178", fontSize: 13 }}
                              >
                                {c.leadPastors}
                              </p>
                            )}
                            {launching && (
                              <p
                                className="mt-2 font-display italic"
                                style={{ color: "#8A5A3C", fontSize: 13 }}
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
