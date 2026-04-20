"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { pickFacesForCampus } from "@/lib/content/campus-faces";
import { FaceCard } from "./FaceCard";

/**
 * "Find someone like me at {campus}" — renders 6 real faces from the Futures
 * family once a visitor has picked their campus. Until per-campus photography
 * is complete, draws from the shared pool (see campus-faces.json _meta).
 *
 * Copy is deliberately honest: "Faces from the Futures family — you'll meet
 * your {campus} crew at the door." No implying every face pictured is from
 * that specific campus until byCampus[slug] is populated.
 */
export function CampusFaces({
  campusSlug,
  campusName,
}: {
  campusSlug: string;
  campusName: string;
}) {
  const { faces, mode } = useMemo(
    () => pickFacesForCampus(campusSlug, 6),
    [campusSlug],
  );

  if (faces.length === 0) return null;

  const isPerCampus = mode === "per-campus";

  return (
    <motion.section
      key={campusSlug}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="mt-10"
      aria-labelledby="campus-faces-heading"
    >
      <div className="mb-5">
        <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-warm-700">
          {isPerCampus ? `Faces at ${campusName}` : "Faces from the Futures family"}
        </p>
        <h3
          id="campus-faces-heading"
          className="mt-2 font-display text-ink-900"
          style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.5rem)", fontWeight: 300, lineHeight: 1.15 }}
        >
          {isPerCampus ? (
            <>
              You&rsquo;ll see people who <em className="italic">look like you</em>.
            </>
          ) : (
            <>
              You&rsquo;re walking into a <em className="italic">family</em>.
            </>
          )}
        </h3>
        {!isPerCampus && (
          <p className="mt-2 max-w-[54ch] font-body text-[14px] leading-relaxed text-ink-600">
            You&rsquo;ll meet your {campusName} crew at the door on Sunday &mdash; this is the wider Futures family they&rsquo;re a part of.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        {faces.map((face, i) => (
          <FaceCard key={face.id} face={face} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
