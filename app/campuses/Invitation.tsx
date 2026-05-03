"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export function Invitation() {
  const reduceMotion = useReducedMotion();
  function openDock() {
    window.dispatchEvent(new Event("futures:open-dock"));
  }

  return (
    <section
      className="relative overflow-hidden py-40 sm:py-56"
      style={{
        background:
          "radial-gradient(ellipse at center, #F2E6D1 0%, #E8C9A6 55%, #C89675 100%)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 text-center sm:px-10">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display"
          style={{
            color: "#1C1A17",
            fontSize: "clamp(3rem, 9vw, 7rem)",
            lineHeight: 1,
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          Come <em className="italic">home</em>.
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-8 max-w-[38ch] font-display italic"
          style={{ color: "#1C1A17", fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)", lineHeight: 1.5, fontWeight: 300 }}
        >
          Whatever you&rsquo;re carrying, whatever you&rsquo;ve been through — there&rsquo;s a place for
          you here.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 flex flex-col items-center gap-5"
        >
          <Link
            href="/plan-a-visit"
            className="group relative inline-flex items-center gap-3 rounded-full px-8 py-4 font-sans transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "#1C1A17",
              color: "#FDFBF6",
              fontSize: 16,
              boxShadow: "0 14px 30px -12px rgba(20,20,20,0.4)",
            }}
          >
            <span>Plan a visit</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>

          <button
            type="button"
            onClick={openDock}
            className="group font-display italic transition-colors"
            style={{ color: "#1C1A17", fontSize: 15 }}
          >
            <span className="lowercase">or talk to us first</span>
            <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
