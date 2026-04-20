"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { pickFacesForCampus } from "@/lib/content/campus-faces";
import { FaceCard } from "./FaceCard";

/**
 * "Who's already at {campus}" — the peer face grid. Rendered after a campus
 * is selected, below <CampusPastorIntro />.
 *
 * Grid: 2 cols mobile → 4 cols md → 6 cols lg (spec).
 * Mobile: shows first 6 with "see more people" expand (spec).
 */
export function CampusFaces({
  campusSlug,
}: {
  campusSlug: string;
}) {
  // On desktop we want up to 12; on mobile first 6 with an expand. Fetch 12.
  const { faces, entry } = useMemo(
    () => pickFacesForCampus(campusSlug, 12),
    [campusSlug],
  );
  const [expanded, setExpanded] = useState(false);

  if (!entry || faces.length === 0) return null;

  const campusName = entry.campus_name;
  const visible = expanded ? faces : faces.slice(0, 6);
  const hasMore = faces.length > 6;

  return (
    <motion.section
      key={campusSlug}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      aria-labelledby="who-heading"
      className="mt-24"
    >
      <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-warm-700">
        who&rsquo;s already at {campusName}
      </p>
      <h2
        id="who-heading"
        className="mt-3 mb-10 max-w-[30ch] font-display italic text-ink-900"
        style={{ fontSize: "clamp(1.5rem, 3.4vw, 2rem)", fontWeight: 300, lineHeight: 1.1 }}
      >
        {faces.length} people you&rsquo;d probably like.
      </h2>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-6">
        {visible.map((face) => (
          <FaceCard key={face.id} face={face} campusName={campusName} />
        ))}
      </div>

      {hasMore && !expanded && (
        <div className="mt-10 flex justify-center md:hidden">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="font-ui text-[12px] uppercase tracking-[0.22em] text-warm-700 underline-offset-4 hover:underline"
          >
            See more people →
          </button>
        </div>
      )}
    </motion.section>
  );
}
