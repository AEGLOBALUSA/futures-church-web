"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Moment = {
  id: string;
  title: string;
  caption: string;
  campus: string;
  image: string;
  accent: string;
};

// Moment tiles. Each image is deliberately chosen so the grid reads as
// globally diverse — Aboriginal Australian, African-American, Venezuelan,
// Indonesian (Javanese, Balinese, Minahasan), South Asian, Brazilian
// representation. When swapping placeholders for real Futures photography,
// keep the ethnic spread of the row intact.
const MOMENTS: Moment[] = [
  {
    id: "paradise-sunday",
    title: "Sunday morning, Paradise",
    caption: "The doors open. The coffee starts. The family arrives.",
    campus: "Paradise · Adelaide",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=75&auto=format&fit=crop",
    accent: "#C8906B",
  },
  {
    id: "la-worship",
    title: "Hands up, Los Angeles",
    caption: "Mid-worship, a few hundred voices holding one note.",
    campus: "Los Angeles · California",
    image: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=1600&q=75&auto=format&fit=crop",
    accent: "#AC9B25",
  },
  {
    id: "futuros-caracas",
    title: "La familia",
    caption: "Spanish, laughter, three generations at one table.",
    campus: "Caracas · Venezuela (launching)",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=75&auto=format&fit=crop",
    accent: "#C45236",
  },
  {
    id: "bali-sunrise",
    title: "Sunrise prayer, Bali",
    caption: "Denpasar, 5:40am — young Balinese leaders before the sun.",
    campus: "Bali · Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=75&auto=format&fit=crop",
    accent: "#8A5A3C",
  },
  {
    id: "kids-mount-barker",
    title: "Kids church, Mount Barker",
    caption: "Loud, bright, safe. Two hours no parent wants to miss.",
    campus: "Mount Barker · Adelaide Hills",
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=1600&q=75&auto=format&fit=crop",
    accent: "#D9B089",
  },
  {
    id: "solo-youth",
    title: "Youth night, Solo",
    caption: "Surakarta's teenagers pack out the hall on Fridays.",
    campus: "Solo · Central Java",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1600&q=75&auto=format&fit=crop",
    accent: "#C8906B",
  },
  {
    id: "online",
    title: "Online church, everywhere",
    caption: "Three time zones, one service. São Paulo, Nairobi, Kansas.",
    campus: "Online · Worldwide",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=75&auto=format&fit=crop",
    accent: "#765020",
  },
  {
    id: "langowan",
    title: "Harvest Sunday, Langowan",
    caption: "Minahasan North Sulawesi fills the church with what it grows.",
    campus: "Langowan · North Sulawesi",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=75&auto=format&fit=crop",
    accent: "#AC9B25",
  },
];

export function HomeMoments() {
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
            initial={{ opacity: 0, y: 14 }}
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
              initial={{ opacity: 0, y: 16 }}
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
                  unoptimized
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
