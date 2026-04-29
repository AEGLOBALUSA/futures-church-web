"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type FamilyCard = {
  slug: string;
  title: string;
  href: string;
  caption: string;
  image: string;
  tone: string;
};

const CARDS: FamilyCard[] = [
  {
    slug: "women",
    title: "bU Women",
    href: "/women",
    caption: "Real women. Real rooms. No mask required.",
    image: "/photos/community/family-bu-women.jpg",
    tone: "#C45236",
  },
  {
    slug: "dreamers",
    title: "Dreamers",
    href: "/dreamers",
    caption: "Young adults who haven\u2019t given up on the dream.",
    image: "/photos/community/family-dreamers.jpg",
    tone: "#AC9B25",
  },
  {
    slug: "kids",
    title: "Kids",
    href: "/kids",
    caption: "Loud, bright, safe. Two hours no parent wants to miss.",
    image: "/photos/community/family-kids.jpg",
    tone: "#D9B089",
  },
  {
    slug: "college",
    title: "Global College",
    href: "/college",
    caption: "Train for a life of following Jesus — and leading.",
    image: "/photos/community/family-college.jpg",
    tone: "#C8906B",
  },
  {
    slug: "selah",
    title: "Selah",
    href: "/selah",
    caption: "A daily pastoral companion. For the questions you can’t google.",
    image: "/photos/community/family-online.jpg",
    tone: "#8A5A3C",
  },
];

export function HomeFamily() {
  return (
    <section className="relative py-28 sm:py-36" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="max-w-[640px]">
          <p
            className="font-sans"
            style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            The family
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
            Every age. Every <em className="italic">stage</em>. One house.
          </motion.h2>
          <p
            className="mt-5 font-sans max-w-[52ch]"
            style={{ color: "#534D44", fontSize: 16, lineHeight: 1.6 }}
          >
            A place for every version of you — the kid on Sunday morning, the 20-something chasing
            a dream, the mother in a hard season, the college student who&rsquo;s ready to go all in.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={c.href}
                className="group block overflow-hidden rounded-[20px]"
                style={{
                  background: c.tone,
                  boxShadow: "0 18px 40px -22px rgba(20,20,20,0.3)",
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    unoptimized
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: c.tone, mixBlendMode: "soft-light", opacity: 0.3 }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 45%, rgba(28,26,23,0.72) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-5 bottom-5 text-[#FDFBF6]">
                    <p className="font-display italic" style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.05 }}>
                      {c.title}
                    </p>
                    <p className="mt-2 font-sans max-w-[28ch]" style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.92 }}>
                      {c.caption}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
