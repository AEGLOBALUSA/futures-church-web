"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

// Asymmetric photo mosaic — editorial, museum-like. 12-column grid, photos
// span varied sizes so the eye has texture to travel through. Real Futures
// photography from Australia, USA, Indonesia, and Venezuela (Futuros).
//
// Layout principles:
//   — mix portrait and landscape
//   — let a few tiles breathe with larger spans
//   — no captions; the pictures carry the weight
//   — diversity intent: ≥50% white (Australian / American), with substantial
//     Indonesian and Spanish-Latin (Futuros / Venezuela) presence
const TILES: { src: string; alt: string; span: string; rowSpan?: string }[] = [
  // Row 1/2 — left tower + two stacks
  { src: "/photos/mosaic/mosaic_au_5.jpg",  alt: "Sojourner Cafe",                                                                  span: "col-span-6 sm:col-span-4", rowSpan: "row-span-2" },
  { src: "/photos/mosaic/mosaic_au_10.jpg", alt: "Three women from the family laughing together after Sunday — Adelaide City",       span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_id_15.jpg", alt: "Pre-service mingle — Bali, Indonesia",                                              span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_13.jpg", alt: "Wider crowd of attendees — Adelaide",                                               span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_id_50.jpg", alt: "Small cluster of people in a kitchen — Solo, Indonesia",                            span: "col-span-6 sm:col-span-4" },

  // Row 3 — two wide
  { src: "/photos/mosaic/mosaic_au_14.jpg", alt: "Wide-frame Sunday gathering",                                                       span: "col-span-6 sm:col-span-6" },
  { src: "/photos/mosaic/mosaic_au_16.jpg", alt: "Three friends laughing — Adelaide City",                                            span: "col-span-6 sm:col-span-6" },

  // Row 4/5 — right tower + two stacks
  { src: "/photos/mosaic/mosaic_au_22.jpg", alt: "Worship",                                                                         span: "col-span-6 sm:col-span-4", rowSpan: "row-span-2" },
  { src: "/photos/mosaic/mosaic_us_12.jpg", alt: "Young woman in a champagne shirt smiling — Atlanta",                                span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_17.jpg", alt: "A couple in conversation by the foyer — Paradise",                                  span: "col-span-6 sm:col-span-4" },
  { src: "/photos/voices/voice_15.jpg", alt: "Mid-event at the bar — Gwinnett",                                                   span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_us_11.jpg", alt: "USA campus",                                                                      span: "col-span-6 sm:col-span-4" },

  // Row 6 — three
  { src: "/photos/voices/voice_16.jpg", alt: "Silhouette against a horizon, lake-side — Duluth",                                  span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_19.jpg", alt: "Couch group, mid-conversation — Salisbury",                                         span: "col-span-6 sm:col-span-4" },
  { src: "/photos/voices/voice_17.jpg", alt: "A pair laughing — Cemani",                                                          span: "col-span-6 sm:col-span-4" },

  // Row 7 — one wide, two narrow
  { src: "/photos/voices/voice_18.jpg", alt: "Four women side-by-side — Atlanta",                                                 span: "col-span-6 sm:col-span-6" },
  { src: "/photos/voices/voice_19.jpg", alt: "Coral floral dress, mid-conversation — Atlanta",                                    span: "col-span-6 sm:col-span-3" },
  { src: "/photos/voices/voice_20.jpg", alt: "An Asian man in a cream jacket against a brick wall",                               span: "col-span-6 sm:col-span-3" },

  // Row 8 — two wide
  { src: "/photos/mosaic/mosaic_au_73.jpg", alt: "Gathering",                                                                       span: "col-span-6 sm:col-span-6" },
  { src: "/photos/mosaic/mosaic_us_2.jpg",  alt: "Franklin",                                                                        span: "col-span-6 sm:col-span-6" },

  // — — — Extension begins here — — —
  // The lower mosaic widens the family's geography: Futuros (Venezuela / Spanish-speaking),
  // Solo and Cemani (Indonesia), and a deeper bench of Australian + USA campuses.

  // Row 9 — left tower (Futuros) + two stacks
  { src: "/photos/campuses/futuros_2.jpg",   alt: "Futuros family — Caracas, Venezuela",                                            span: "col-span-6 sm:col-span-4", rowSpan: "row-span-2" },
  { src: "/photos/campuses/solo_4.jpg",      alt: "Sunday morning — Solo, Indonesia",                                               span: "col-span-6 sm:col-span-4" },
  { src: "/photos/campuses/salisbury_4.jpg", alt: "Salisbury small group — Adelaide, Australia",                                    span: "col-span-6 sm:col-span-4" },
  { src: "/photos/campuses/paradise_4.jpg",  alt: "Paradise campus — Adelaide, Australia",                                          span: "col-span-6 sm:col-span-4" },
  { src: "/photos/campuses/futuros_5.jpg",   alt: "Hands raised — Futuros, Venezuela",                                              span: "col-span-6 sm:col-span-4" },

  // Row 10 — two wide
  { src: "/photos/campuses/cemani_5.jpg",    alt: "Cemani gathering — Indonesia",                                                   span: "col-span-6 sm:col-span-6" },
  { src: "/photos/campuses/franklin_3.jpg",  alt: "Franklin, Tennessee — kids and parents",                                         span: "col-span-6 sm:col-span-6" },

  // Row 11/12 — right tower (Futuros) + two stacks
  { src: "/photos/campuses/futuros_3.jpg",   alt: "Caracas, Venezuela — laughter",                                                  span: "col-span-6 sm:col-span-4", rowSpan: "row-span-2" },
  { src: "/photos/campuses/clare_5.jpg",     alt: "Clare Valley campus — South Australia",                                          span: "col-span-6 sm:col-span-4" },
  { src: "/photos/campuses/solo_8.jpg",      alt: "Solo, Indonesia — small group",                                                  span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_18.jpg",  alt: "Sunday in the foyer — Adelaide",                                                 span: "col-span-6 sm:col-span-4" },
  { src: "/photos/campuses/futuros_7.jpg",   alt: "Communion — Futuros, Venezuela",                                                 span: "col-span-6 sm:col-span-4" },

  // Row 13 — three
  { src: "/photos/mosaic/mosaic_au_29.jpg",  alt: "Adelaide gathering",                                                             span: "col-span-6 sm:col-span-4" },
  { src: "/photos/campuses/cemani_7.jpg",    alt: "Cemani, Indonesia — Sunday",                                                     span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_42.jpg",  alt: "Adelaide City — kids running",                                                   span: "col-span-6 sm:col-span-4" },

  // Row 14 — one wide, two narrow
  { src: "/photos/campuses/futuros_10.jpg",  alt: "A wide gathering — Futuros, Venezuela",                                          span: "col-span-6 sm:col-span-6" },
  { src: "/photos/mosaic/mosaic_id_30.jpg",  alt: "Indonesian gathering",                                                           span: "col-span-6 sm:col-span-3" },
  { src: "/photos/campuses/futuros_4.jpg",   alt: "A Futuros couple — Caracas, Venezuela",                                          span: "col-span-6 sm:col-span-3" },

  // Row 15 — two wide closer
  { src: "/photos/campuses/kadina_3.jpg",    alt: "Kadina campus — South Australia",                                                span: "col-span-6 sm:col-span-6" },
  { src: "/photos/campuses/mtbarker_4.jpg",  alt: "Mt Barker campus — Adelaide Hills",                                              span: "col-span-6 sm:col-span-6" },
];

export function HomeMosaic() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden py-28 sm:py-36"
      style={{ background: "#F7F1E6" }}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-[52ch]"
        >
          <p
            className="font-sans"
            style={{
              color: "#1C1A17",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Life at Futures
          </p>
          <h2
            className="mt-4 font-display"
            style={{
              color: "#1C1A17",
              fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
              lineHeight: 1.05,
              fontWeight: 300,
            }}
          >
            Real people. Real Sundays. Real rooms.
          </h2>
          <p
            className="mt-5 max-w-[46ch] font-sans"
            style={{ color: "#534D44", fontSize: 17, lineHeight: 1.6 }}
          >
            No stock. No staging. A mosaic of the weeks that made us a family —
            worship, lunch, laughter, prayer, kids, Mondays, Sundays, life.
          </p>
        </motion.div>

        <div
          className="mt-14 grid grid-cols-12 gap-3 sm:gap-4"
          style={{ gridAutoRows: "clamp(140px, 14vw, 220px)" }}
        >
          {TILES.map((t, i) => (
            <motion.figure
              key={t.src}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: (i % 6) * 0.06,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={`group relative overflow-hidden rounded-[14px] ${t.span} ${t.rowSpan ?? ""}`}
              style={{
                background: "#E8DFD3",
                boxShadow: "0 14px 32px -22px rgba(20,20,20,0.35)",
              }}
            >
              <Image
                src={t.src}
                alt={t.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-soft-light"
                style={{ background: "#D9B089", opacity: 0.1 }}
              />
            </motion.figure>
          ))}
        </div>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-16 max-w-[48ch] text-center"
        >
          <p
            className="font-display italic"
            style={{ color: "#1C1A17", fontSize: "clamp(1.25rem, 2vw, 1.5rem)", lineHeight: 1.45, fontWeight: 300 }}
          >
            There is a seat at this table for you.
          </p>
          <Link
            href="/plan-a-visit"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-sans transition-all duration-300 hover:-translate-y-0.5"
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
            Plan a visit
            <span className="transition-transform duration-300 hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
