"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type Moment = {
  id: string;
  title: string;
  caption: string;
  campus: string;
  image: string;
  accent: string;
};

const MOMENTS: Moment[] = [
  {
    id: "paradise-sunday",
    title: "Sunday morning, Paradise",
    caption: "The doors open. The coffee starts. The family arrives.",
    campus: "Paradise · Adelaide",
    image: "/photos/community/moment-sunday-foyer.jpg",
    accent: "#C8906B",
  },
  {
    id: "gwinnett-worship",
    title: "Hands up, Gwinnett",
    caption: "Mid-worship, a few hundred voices holding one note.",
    campus: "Gwinnett · Georgia",
    image: "/photos/mosaic/mosaic_us_11.jpg",
    accent: "#AC9B25",
  },
  {
    id: "futuros-duluth",
    title: "La familia, Futuros",
    caption: "Spanish, laughter, three generations at one table.",
    campus: "Futuros Duluth · Georgia",
    image: "/photos/mosaic/mosaic_us_12.jpg",
    accent: "#C45236",
  },
  {
    id: "bali-sunday",
    title: "Sunday morning, Bali",
    caption: "Denpasar — young Balinese believers filling the room.",
    campus: "Bali · Indonesia",
    image: "/photos/mosaic/mosaic_id_15.jpg",
    accent: "#8A5A3C",
  },
  {
    id: "kids-mount-barker",
    title: "Kids church, Mount Barker",
    caption: "Loud, bright, safe. Two hours no parent wants to miss.",
    campus: "Mount Barker · Adelaide Hills",
    image: "/photos/mosaic/mosaic_au_20.jpg",
    accent: "#D9B089",
  },
  {
    id: "solo-youth",
    title: "Youth night, Solo",
    caption: "Surakarta's teenagers pack out the hall on Fridays.",
    campus: "Solo · Central Java",
    image: "/photos/mosaic/mosaic_id_30.jpg",
    accent: "#C8906B",
  },
  {
    id: "online",
    title: "Online church, everywhere",
    caption: "Three time zones, one service. São Paulo, Nairobi, Kansas.",
    campus: "Online · Worldwide",
    image: "/photos/mosaic/mosaic_us_2.jpg",
    accent: "#765020",
  },
  {
    id: "langowan",
    title: "Harvest Sunday, Langowan",
    caption: "Minahasan North Sulawesi fills the church with what it grows.",
    campus: "Langowan · North Sulawesi",
    image: "/photos/mosaic/mosaic_id_50.jpg",
    accent: "#AC9B25",
  },
];

export function HomeMoments() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative py-28 sm:py-36" style={{ background: "#FDFBF6" }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="mb-10">
          <p
            className="font-sans"
            style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            One family · many rooms
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
            A week across the family.
          </motion.h2>
          <p
            className="mt-5 font-sans max-w-[50ch]"
            style={{ color: "#534D44", fontSize: 16, lineHeight: 1.6 }}
          >
            Real moments, real rooms — every tile is a Sunday (or Tuesday, or
            5:40am Wednesday) somewhere in the Futures family this week.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOMENTS.map((m, i) => (
            <motion.article
              key={m.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative overflow-hidden rounded-[22px]"
              style={{
                boxShadow: "0 18px 40px -22px rgba(20,20,20,0.3)",
              }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={m.image}
                  alt={m.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.05]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: m.accent,
                    mixBlendMode: "soft-light",
                    opacity: 0.3,
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(28,26,23,0.78) 100%)",
                  }}
                />
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
                    {m.campus}
                  </p>
                  <h3 className="mt-1 font-display italic" style={{ fontSize: 24, fontWeight: 300 }}>
                    {m.title}
                  </h3>
                  <p className="mt-2 font-sans" style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.92 }}>
                    {m.caption}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
