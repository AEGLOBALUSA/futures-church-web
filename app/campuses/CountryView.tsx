"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { campuses, type CampusRegion } from "@/lib/content/campuses";
import { CAMPUS_PHOTOS } from "./CampusesMap";

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

const REGION_COPY: Record<CampusRegion, { lede: string; sub: string }> = {
  australia: {
    lede: "Eight campuses across South Australia.",
    sub: "Led under Ps Josh & Sjhana Greenwood (Australia Lead) — part of the global Futures family under Ps Ashley & Jane Evans.",
  },
  usa: {
    lede: "Four Futures campuses plus three Futuros (Spanish-language) campuses across the American south.",
    sub: "Home of the global Senior Pastors, Ashley & Jane Evans (Gwinnett).",
  },
  indonesia: {
    lede: "Five campuses across Java, Sulawesi, Kalimantan, and Bali.",
    sub: "One family across the archipelago — worshipping in Indonesian, gathering in community.",
  },
  venezuela: {
    lede: "Four Futuros campuses launching through 2026.",
    sub: "Campuses 22, 23, 24, and 25 — our next frontier, in partnership with local pastors on the ground.",
  },
  global: {
    lede: "Futures Online Church — one congregation, every time zone.",
    sub: "Sunday services stream live with real hosts, real prayer, and real pastors in the chat.",
  },
};

export function CountryView({ region }: { region: CampusRegion }) {
  const list = campuses.filter((c) => c.region === region);
  const copy = REGION_COPY[region];
  const tone = REGION_TONE[region];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
    >
      {/* Breadcrumb */}
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
        <span>Futures · all campuses</span>
      </Link>

      <div className="mt-6 flex items-baseline gap-3">
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
          {REGION_LABEL[region]} · {list.length} {list.length === 1 ? "campus" : "campuses"}
        </p>
      </div>

      <h2
        className="mt-3 font-display max-w-[22ch]"
        style={{
          color: "#1C1A17",
          fontSize: "clamp(2rem, 3.8vw, 3rem)",
          lineHeight: 1.05,
          fontWeight: 300,
        }}
      >
        {copy.lede}
      </h2>
      <p
        className="mt-4 font-sans max-w-[52ch]"
        style={{ color: "#534D44", fontSize: 16, lineHeight: 1.6 }}
      >
        {copy.sub}
      </p>

      {/* Campus cards */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {list.map((c, i) => {
          const photo = CAMPUS_PHOTOS[c.slug];
          const isLaunching = c.status === "launching";
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={`/campuses/${c.slug}`}
                scroll={false}
                className="group block overflow-hidden rounded-[18px]"
                style={{
                  background: tone,
                  boxShadow: "0 16px 36px -18px rgba(20,20,20,0.28)",
                  opacity: isLaunching ? 0.78 : 1,
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {photo && (
                    <Image
                      src={photo}
                      alt={`${c.name} — ${c.city}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      unoptimized
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ background: tone, mixBlendMode: "soft-light", opacity: 0.35 }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 40%, rgba(28,26,23,0.72) 100%)",
                    }}
                  />
                  {isLaunching && (
                    <span
                      className="absolute top-4 left-4 rounded-full px-2.5 py-1 font-sans"
                      style={{
                        background: "rgba(253,251,246,0.92)",
                        color: "#1C1A17",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                      }}
                    >
                      Launching · 2026
                    </span>
                  )}
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
                    <p className="mt-1 font-display italic" style={{ fontSize: 22, fontWeight: 300 }}>
                      {c.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#FDFBF6] px-5 py-4">
                  <div className="min-w-0">
                    {c.leadPastors ? (
                      <p className="truncate font-sans" style={{ color: "#1C1A17", fontSize: 13 }}>
                        {c.leadPastors}
                      </p>
                    ) : (
                      <p className="font-display italic" style={{ color: "#8A8178", fontSize: 13 }}>
                        campus pastors coming soon
                      </p>
                    )}
                  </div>
                  <span
                    className="font-sans opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ color: tone, fontSize: 13 }}
                  >
                    visit →
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
