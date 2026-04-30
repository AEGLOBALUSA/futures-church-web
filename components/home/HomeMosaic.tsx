"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

// Asymmetric photo mosaic — editorial, museum-like. 12-column grid, photos
// span varied sizes so the eye has texture to travel through. Real Futures
// photography from Australia and USA.
//
// Layout principles:
//   — mix portrait and landscape
//   — let a few tiles breathe with larger spans
//   — no captions; the pictures carry the weight
const TILES: { src: string; alt: string; span: string; rowSpan?: string }[] = [
  // Row 1/2 — left tower + two stacks
  { src: "/photos/mosaic/mosaic_au_5.jpg",  alt: "Sojourner Cafe",                                                                  span: "col-span-6 sm:col-span-4", rowSpan: "row-span-2" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/dscf1346-md.jpg", alt: "Three women from the family laughing together after Sunday — Adelaide City",       span: "col-span-6 sm:col-span-4" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/7i8a0252-md.jpg", alt: "Pre-service mingle — Bali, Indonesia",                                              span: "col-span-6 sm:col-span-4" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/img_2190-md.jpg", alt: "Wider crowd of attendees — Adelaide",                                               span: "col-span-6 sm:col-span-4" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/img_2104-md.jpg", alt: "Small cluster of people in a kitchen — Solo, Indonesia",                            span: "col-span-6 sm:col-span-4" },

  // Row 3 — two wide
  { src: "https://futures-church-v3.netlify.app/v3-photos/mdia2516-md.jpg", alt: "Wide-frame Sunday gathering",                                                       span: "col-span-6 sm:col-span-6" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/dscf1360-md.jpg", alt: "Three friends laughing — Adelaide City",                                            span: "col-span-6 sm:col-span-6" },

  // Row 4/5 — right tower + two stacks
  { src: "/photos/mosaic/mosaic_au_22.jpg", alt: "Worship",                                                                         span: "col-span-6 sm:col-span-4", rowSpan: "row-span-2" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/wgb_8291-md.jpg", alt: "Young woman in a champagne shirt smiling — Atlanta",                                span: "col-span-6 sm:col-span-4" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/7i8a9019-md.jpg", alt: "A couple in conversation by the foyer — Paradise",                                  span: "col-span-6 sm:col-span-4" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/img_2153-md.jpg", alt: "Mid-event at the bar — Gwinnett",                                                   span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_us_11.jpg", alt: "USA campus",                                                                      span: "col-span-6 sm:col-span-4" },

  // Row 6 — three
  { src: "https://futures-church-v3.netlify.app/v3-photos/as3_8268-md.jpg", alt: "Silhouette against a horizon, lake-side — Duluth",                                  span: "col-span-6 sm:col-span-4" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/wgb_4940-md.jpg", alt: "Couch group, mid-conversation — Salisbury",                                         span: "col-span-6 sm:col-span-4" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/7i8a9271-md.jpg", alt: "A pair laughing — Cemani",                                                          span: "col-span-6 sm:col-span-4" },

  // Row 7 — one wide, two narrow
  { src: "https://futures-church-v3.netlify.app/v3-photos/wgb_7742-md.jpg", alt: "Four women side-by-side — Atlanta",                                                 span: "col-span-6 sm:col-span-6" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/wgb_6089-md.jpg", alt: "Coral floral dress, mid-conversation — Atlanta",                                    span: "col-span-6 sm:col-span-3" },
  { src: "https://futures-church-v3.netlify.app/v3-photos/as3_7587-md.jpg", alt: "An Asian man in a cream jacket against a brick wall",                               span: "col-span-6 sm:col-span-3" },

  // Row 8 — two wide
  { src: "/photos/mosaic/mosaic_au_73.jpg", alt: "Gathering",                                                                       span: "col-span-6 sm:col-span-6" },
  { src: "/photos/mosaic/mosaic_us_2.jpg",  alt: "Franklin",                                                                        span: "col-span-6 sm:col-span-6" },
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
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

// Asymmetric photo mosaic — editorial, museum-like. 12-column grid, photos
// span varied sizes so the eye has texture to travel through. Real Futures
// photography from Australia and USA.
//
// Layout principles:
//   — mix portrait and landscape
//   — let a few tiles breathe with larger spans
//   — no captions; the pictures carry the weight
const TILES: { src: string; alt: string; span: string; rowSpan?: string }[] = [
  // Row 1/2 — left tower + two stacks
  { src: "/photos/mosaic/mosaic_au_5.jpg",  alt: "Sojourner Cafe",      span: "col-span-6 sm:col-span-4", rowSpan: "row-span-2" },
  { src: "/photos/mosaic/mosaic_au_8.jpg",  alt: "Youth connecting",    span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_14.jpg", alt: "Kids ministry",       span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_28.jpg", alt: "Community",           span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_35.jpg", alt: "Family",              span: "col-span-6 sm:col-span-4" },

  // Row 3 — two wide
  { src: "/photos/mosaic/mosaic_au_71.jpg", alt: "Baptism",             span: "col-span-6 sm:col-span-6" },
  { src: "/photos/mosaic/mosaic_au_25.jpg", alt: "A Sunday moment",     span: "col-span-6 sm:col-span-6" },

  // Row 4/5 — right tower + two stacks
  { src: "/photos/mosaic/mosaic_au_22.jpg", alt: "Worship",             span: "col-span-6 sm:col-span-4", rowSpan: "row-span-2" },
  { src: "/photos/mosaic/mosaic_au_9.jpg",  alt: "Young hearts",        span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_13.jpg", alt: "A glimpse",           span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_62.jpg", alt: "Sunday lunch",        span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_us_11.jpg", alt: "USA campus",          span: "col-span-6 sm:col-span-4" },

  // Row 6 — three
  { src: "/photos/mosaic/mosaic_au_44.jpg", alt: "In the rain",         span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_17.jpg", alt: "Friendship",          span: "col-span-6 sm:col-span-4" },
  { src: "/photos/mosaic/mosaic_au_41.jpg", alt: "The room",            span: "col-span-6 sm:col-span-4" },

  // Row 7 — one wide, two narrow
  { src: "/photos/mosaic/mosaic_au_45.jpg", alt: "Together",            span: "col-span-6 sm:col-span-6" },
  { src: "/photos/mosaic/mosaic_au_42.jpg", alt: "Prayer",              span: "col-span-6 sm:col-span-3" },
  { src: "/photos/mosaic/mosaic_au_27.jpg", alt: "Sunday arrival",      span: "col-span-6 sm:col-span-3" },

  // Row 8 — two wide
  { src: "/photos/mosaic/mosaic_au_73.jpg", alt: "Gathering",           span: "col-span-6 sm:col-span-6" },
  { src: "/photos/mosaic/mosaic_us_2.jpg",  alt: "Franklin",            span: "col-span-6 sm:col-span-6" },
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
