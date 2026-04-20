"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import type { CampusFace } from "@/lib/content/campus-faces";

/**
 * A single face in the CampusFaces grid. Default state: just the photo, rounded,
 * warm. If comms has filled in firstName + story, the card becomes tappable and
 * expands to show that (honestly, briefly). Never fabricates name/story.
 */
export function FaceCard({ face, index }: { face: CampusFace; index: number }) {
  const [open, setOpen] = useState(false);
  const hasStory = Boolean(face.firstName && face.story);

  const card = (
    <div className="relative h-full w-full overflow-hidden rounded-2xl" style={{ background: "#E8DFD3" }}>
      <Image
        src={face.imageUrl}
        alt={face.alt}
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 160px"
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        unoptimized
        loading="lazy"
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-soft-light"
        style={{ background: "#D9B089", opacity: 0.1 }}
      />
      {hasStory && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 p-2"
          style={{
            background:
              "linear-gradient(to top, rgba(20,20,20,0.55), transparent)",
          }}
        >
          <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/90">
            {face.firstName}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: (index % 6) * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group relative aspect-square"
      style={{ boxShadow: "0 10px 24px -18px rgba(20,20,20,0.35)" }}
    >
      {hasStory ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="block h-full w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-warm-500/60"
          aria-expanded={open}
          aria-label={`Read ${face.firstName}'s story`}
        >
          {card}
        </button>
      ) : (
        card
      )}

      {hasStory && open && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 right-0 top-full z-10 mt-2 rounded-xl bg-white p-4 shadow-lg"
          role="tooltip"
        >
          <p className="font-display italic text-ink-900" style={{ fontSize: 15, fontWeight: 300 }}>
            {face.firstName}
          </p>
          {face.joinedWhen && (
            <p className="mt-0.5 font-ui text-[10px] uppercase tracking-[0.2em] text-warm-700">
              {face.joinedWhen}
            </p>
          )}
          <p className="mt-2 font-body text-[13px] leading-relaxed text-ink-700">
            {face.story}
          </p>
        </motion.div>
      )}
    </motion.figure>
  );
}
