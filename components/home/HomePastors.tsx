"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type Pastor = {
  name: string;
  role: string;
  image: string;
  tone: string;
};

const GLOBAL: Pastor[] = [
  {
    name: "Ashley & Jane Evans",
    role: "Global Senior Pastors",
    image: "/photos/pastors/ashley-jane.jpg",
    tone: "#C45236",
  },
];

const AUSTRALIA: Pastor[] = [
  {
    name: "Josh & Sjhana Greenwood",
    role: "Australia Lead Pastors",
    image: "/photos/pastors/josh-sjhana.jpg",
    tone: "#C8906B",
  },
];

export function HomePastors() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative py-28 sm:py-40" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div>
            <p
              className="font-sans"
              style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
            >
              Meet the pastors
            </p>
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-3 font-display"
              style={{
                color: "#1C1A17",
                fontSize: "clamp(2.25rem, 4.8vw, 3.75rem)",
                lineHeight: 1.02,
                fontWeight: 300,
              }}
            >
              Real <em className="italic">pastors</em>. Real families. One house.
            </motion.h2>
            <p
              className="mt-5 font-sans max-w-[50ch]"
              style={{ color: "#534D44", fontSize: 16.5, lineHeight: 1.6 }}
            >
              Twenty-six years of Sundays. Four countries. A family of pastors under one roof —
              carrying the same love, the same call, in every city we plant.
            </p>
            <Link
              href="/leaders"
              className="mt-8 inline-flex items-center gap-2 font-display italic"
              style={{ color: "#534D44", fontSize: 15 }}
            >
              <span>meet the whole team</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="space-y-6">
            {GLOBAL.map((p, i) => (
              <PastorCard key={p.name} pastor={p} i={i} primary />
            ))}
            {AUSTRALIA.map((p, i) => (
              <PastorCard key={p.name} pastor={p} i={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PastorCard({
  pastor,
  i,
  primary = false,
}: {
  pastor: Pastor;
  i: number;
  primary?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-[22px]"
      style={{
        boxShadow: "0 20px 44px -22px rgba(20,20,20,0.3)",
        background: pastor.tone,
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: primary ? "16 / 10" : "16 / 9" }}
      >
        <Image
          src={pastor.image}
          alt={pastor.name}
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
          unoptimized
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: pastor.tone, mixBlendMode: "soft-light", opacity: 0.3 }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 45%, rgba(28,26,23,0.72) 100%)",
          }}
        />
      </div>
      <div className="absolute inset-x-6 bottom-5 text-[#FDFBF6]">
        <p
          className="font-sans"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          {pastor.role}
        </p>
        <h3
          className="mt-1 font-display italic"
          style={{ fontSize: primary ? 32 : 24, fontWeight: 300, lineHeight: 1.05 }}
        >
          {pastor.name}
        </h3>
      </div>
    </motion.article>
  );
}
