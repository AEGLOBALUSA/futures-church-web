"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, BookOpen, Smartphone } from "lucide-react";

const RHYTHMS = [
  {
    slug: "watch",
    title: "Watch this Sunday",
    caption: "Every service, every campus, streaming live and on-demand.",
    href: "/watch",
    cta: "open the player",
    icon: Play,
    tone: "#C45236",
  },
  {
    slug: "daily-word",
    title: "Daily Word",
    caption: "One short reading. Every morning. In your inbox.",
    href: "/daily-word",
    cta: "subscribe",
    icon: BookOpen,
    tone: "#C8906B",
  },
  {
    slug: "selah",
    title: "Selah — our app",
    caption: "A daily pastoral companion. For the questions you can't google.",
    href: "/selah",
    cta: "learn more",
    icon: Smartphone,
    tone: "#AC9B25",
  },
];

export function HomeRhythms() {
  return (
    <section className="relative py-28 sm:py-36" style={{ background: "#FDFBF6" }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="max-w-[640px]">
          <p
            className="font-sans"
            style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            Rhythms for the week
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-3 font-display"
            style={{
              color: "#1C1A17",
              fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
              lineHeight: 1.02,
              fontWeight: 300,
            }}
          >
            A little with us, <em className="italic">every day</em>.
          </motion.h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {RHYTHMS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link
                  href={r.href}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] p-7 transition-all hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(20,20,20,0.06)",
                    boxShadow: "0 18px 40px -24px rgba(20,20,20,0.22)",
                    minHeight: 260,
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                    style={{ background: r.tone, filter: "blur(24px)" }}
                  />
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: r.tone, color: "#FDFBF6" }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="relative">
                    <h3
                      className="font-display italic"
                      style={{ color: "#1C1A17", fontSize: 28, fontWeight: 300, lineHeight: 1.05 }}
                    >
                      {r.title}
                    </h3>
                    <p
                      className="mt-3 font-sans max-w-[28ch]"
                      style={{ color: "#534D44", fontSize: 15, lineHeight: 1.6 }}
                    >
                      {r.caption}
                    </p>
                    <p
                      className="mt-5 font-sans inline-flex items-center gap-1.5"
                      style={{ color: r.tone, fontSize: 13 }}
                    >
                      <span>{r.cta}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </p>
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
