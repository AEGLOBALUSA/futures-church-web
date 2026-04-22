"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

// 34 portraits from the Voices shoot. Infinite-marquee horizontal rail — the
// family parading past, unhurried. No captions beyond a quiet "Futures · South
// Australia" strip underneath, because the faces carry the message.
const VOICE_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34,
];

export function HomeVoices() {
  const reduceMotion = useReducedMotion();

  // Double the list so the marquee can loop seamlessly.
  const doubled = useMemo(() => [...VOICE_NUMBERS, ...VOICE_NUMBERS], []);

  return (
    <section
      className="relative overflow-hidden py-28 sm:py-36"
      style={{ background: "#FDFBF6" }}
    >
      {/* Eyebrow + headline */}
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
            The family · Faces of Futures
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
            One family. <em className="italic">Every</em> age. <em className="italic">Every</em> stage.
          </h2>
          <p
            className="mt-5 max-w-[44ch] font-sans"
            style={{ color: "#534D44", fontSize: 17, lineHeight: 1.6 }}
          >
            These are the people of Futures — students, tradies, nurses,
            grandparents, newlyweds, kids. There&rsquo;s a seat already saved for you.
          </p>
        </motion.div>
      </div>

      {/* Infinite marquee rail */}
      <div
        className="relative mt-16"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <motion.div
          className="flex gap-4 will-change-transform"
          animate={
            reduceMotion ? undefined : { x: ["0%", "-50%"] }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 90, ease: "linear", repeat: Infinity }
          }
          style={{ width: "max-content" }}
        >
          {doubled.map((n, i) => (
            <div
              key={`${n}-${i}`}
              className="relative overflow-hidden rounded-[14px]"
              style={{
                width: "clamp(180px, 18vw, 260px)",
                aspectRatio: "4 / 5",
                flex: "0 0 auto",
                background: "#E8DFD3",
                boxShadow: "0 12px 28px -18px rgba(20,20,20,0.35)",
              }}
            >
              <Image
                src={`/photos/voices/voice_${n}.jpg`}
                alt="A face from Futures Church"
                fill
                sizes="260px"
                className="object-cover"
                loading="lazy"
              />
              {/* Gentle warm wash for cohesion */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-soft-light"
                style={{ background: "#D9B089", opacity: 0.12 }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom caption */}
      <div className="mx-auto mt-14 max-w-[1440px] px-6 text-center sm:px-10 lg:px-16">
        <p
          className="font-display italic"
          style={{
            color: "#534D44",
            fontSize: "clamp(1rem, 1.4vw, 1.125rem)",
            lineHeight: 1.5,
          }}
        >
          Futures · one family in five nations
        </p>
      </div>
    </section>
  );
}
