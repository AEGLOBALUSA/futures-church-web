"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { visitFears } from "@/lib/content/visit-fears";

/**
 * Three honest first-timer fears, answered honestly. Lives directly below
 * CampusFaces in the Step 1 card. Accordion pattern — one fear open at a time.
 * Copy in content/visit-fears.json so it can be tuned without code changes.
 */
export function VisitFears() {
  const [openId, setOpenId] = useState<string | null>(visitFears[0]?.id ?? null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="mt-12"
      aria-labelledby="visit-fears-heading"
    >
      <div className="mb-5">
        <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-warm-700">
          Honest answers
        </p>
        <h3
          id="visit-fears-heading"
          className="mt-2 font-display text-ink-900"
          style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.5rem)", fontWeight: 300, lineHeight: 1.15 }}
        >
          What people <em className="italic">actually</em> worry about.
        </h3>
      </div>

      <ul className="divide-y divide-ink-900/10 border-y border-ink-900/10">
        {visitFears.map((fear) => {
          const open = openId === fear.id;
          return (
            <li key={fear.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : fear.id)}
                className="flex w-full items-start justify-between gap-4 py-5 text-left focus:outline-none"
                aria-expanded={open}
                aria-controls={`fear-${fear.id}`}
              >
                <span
                  className="font-display text-ink-900"
                  style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)", fontWeight: 300 }}
                >
                  {fear.heading}
                </span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 font-ui text-[18px] leading-none text-warm-700 transition-transform"
                  style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <motion.div
                id={`fear-${fear.id}`}
                role="region"
                initial={false}
                animate={{
                  height: open ? "auto" : 0,
                  opacity: open ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="pb-5 pr-8">
                  <p className="font-body text-[15px] leading-relaxed text-ink-700">
                    {fear.honest}
                  </p>
                  {fear.followup && (
                    <p className="mt-3 font-body text-[13px] italic leading-relaxed text-ink-600">
                      {fear.followup}
                    </p>
                  )}
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}
