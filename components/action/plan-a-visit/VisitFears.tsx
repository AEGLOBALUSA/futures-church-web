"use client";

import { motion } from "framer-motion";
import { visitFears } from "@/lib/content/visit-fears";

/**
 * "What if..." — three universal first-timer fears, three honest answers.
 * Per spec: no accordion, all three visible at once. The visitor reads them
 * as a reassurance flight before the form fields.
 */
export function VisitFears() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      aria-labelledby="fears-heading"
      className="mx-auto mt-24 max-w-[780px]"
    >
      <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-warm-700">
        what if&hellip;
      </p>
      <h2
        id="fears-heading"
        className="mt-3 mb-10 max-w-[28ch] font-display italic text-ink-900"
        style={{ fontSize: "clamp(1.5rem, 3.4vw, 2rem)", fontWeight: 300, lineHeight: 1.1 }}
      >
        Three things people worry about before they come.
      </h2>

      <div className="space-y-10">
        {visitFears.map((fear) => (
          <div key={fear.id}>
            <p
              className="max-w-[36ch] font-display italic text-ink-900"
              style={{ fontSize: "clamp(1.15rem, 2vw, 1.5rem)", fontWeight: 300, lineHeight: 1.25 }}
            >
              {fear.fear}
            </p>
            <p className="mt-3 max-w-[58ch] font-body text-[15.5px] leading-[1.65] text-ink-600">
              {fear.answer}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
