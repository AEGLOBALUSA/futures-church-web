"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { campuses } from "@/lib/content/campuses";
import { CAMPUS_PHOTOS } from "@/app/campuses/CampusesMap";

const FLAGSHIP_SLUGS = [
  "paradise",
  "gwinnett",
  "adelaide-city",
  "bali",
  "solo",
  "futuros-duluth",
];

const REGION_TONE: Record<string, string> = {
  australia: "#C8906B",
  usa: "#AC9B25",
  indonesia: "#C45236",
  venezuela: "#8A5A3C",
  global: "#D9B089",
};

export function HomeCampuses() {
  const reduceMotion = useReducedMotion();
  const flagships = FLAGSHIP_SLUGS
    .map((slug) => campuses.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <section className="relative py-28 sm:py-36" style={{ background: "#FDFBF6" }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="font-sans"
              style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
            >
              21 campuses · 4 countries
            </p>
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-3 font-display max-w-[22ch]"
              style={{
                color: "#1C1A17",
                fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
                lineHeight: 1.02,
                fontWeight: 300,
              }}
            >
              Twenty-one local churches. One family.
            </motion.h2>
          </div>

          <Link
            href="/campuses"
            className="group inline-flex items-center gap-2 self-start rounded-full px-5 py-3 font-display italic transition-all hover:-translate-y-0.5 sm:self-end"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(20,20,20,0.08)",
              color: "#1C1A17",
              fontSize: 15,
            }}
          >
            <span>see all 21 campuses</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {flagships.map((c, i) => {
            const photo = CAMPUS_PHOTOS[c.slug];
            const tone = REGION_TONE[c.region] ?? "#C8906B";
            return (
              <motion.div
                key={c.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link
                  href={`/campuses/${c.slug}`}
                  className="group block overflow-hidden rounded-[20px]"
                  style={{
                    background: tone,
                    boxShadow: "0 18px 40px -22px rgba(20,20,20,0.3)",
                  }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {photo && (
                      <Image
                        src={photo}
                        alt={`${c.name} — ${c.city}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                      />
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: tone, mixBlendMode: "soft-light", opacity: 0.3 }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 45%, rgba(28,26,23,0.72) 100%)",
                      }}
                    />
                    {c.status === "launching" && (
                      <div
                        className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-2.5 py-1"
                        style={{
                          background: "rgba(184, 92, 59, 0.92)",
                          boxShadow: "0 4px 14px -4px rgba(184, 92, 59, 0.55)",
                        }}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span
                            className="absolute inline-flex h-full w-full animate-ping rounded-full"
                            style={{ background: "#FDFBF6", opacity: 0.8 }}
                          />
                          <span
                            className="relative inline-flex h-1.5 w-1.5 rounded-full"
                            style={{ background: "#FDFBF6" }}
                          />
                        </span>
                        <span
                          className="font-sans"
                          style={{
                            fontSize: 9.5,
                            letterSpacing: "0.26em",
                            color: "#FDFBF6",
                            textTransform: "uppercase",
                          }}
                        >
                          Launching
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-5 bottom-5 text-[#FDFBF6]">
                      <p
                        className="font-sans"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          opacity: 0.85,
                        }}
                      >
                        {c.city}
                      </p>
                      <p className="mt-1 font-display italic" style={{ fontSize: 24, fontWeight: 300 }}>
                        {c.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-[#FDFBF6] px-5 py-4">
                    <p className="truncate font-sans" style={{ color: "#1C1A17", fontSize: 13 }}>
                      {c.leadPastors ?? c.country}
                    </p>
                    <span
                      className="font-sans"
                      style={{
                        color: c.status === "launching" ? "#B85C3B" : tone,
                        fontSize: 13,
                      }}
                    >
                      visit →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
