"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { footerStrip } from "@/lib/content/faces";

export function HomeInvitation() {
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
        {/* Goodbye strip — 10 faces from across the family, saying "we'll see
            you tomorrow". Anchored above the headline so the whole section
            reads as a handoff rather than a sign-off. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="goodbye-strip mx-auto mb-14 flex max-w-[640px] flex-col items-center gap-5"
          aria-label="Ten portraits from across the Futures family"
        >
          <ul
            role="img"
            aria-label="Portraits from ten Futures campuses"
            className="flex items-center justify-center -space-x-2 sm:-space-x-3"
          >
            {footerStrip.slice(0, 10).map((p, i) => (
              <li
                key={p.id}
                className="goodbye-face"
                style={{
                  zIndex: 10 - i,
                  animationDelay: `${i * 120}ms`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  width={48}
                  height={48}
                  className="h-[44px] w-[44px] rounded-full object-cover ring-2 sm:h-12 sm:w-12"
                  style={{
                    // Cream ring so overlapping faces read as distinct circles
                    // over the warm radial background.
                    boxShadow: "0 0 0 2px #FDFBF6",
                    filter: "saturate(0.9)",
                  }}
                />
              </li>
            ))}
          </ul>
          <p
            className="font-display italic"
            style={{
              color: "#1C1A17",
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.4,
            }}
          >
            from us, to you, tomorrow morning at 6.
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
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
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-8 max-w-[38ch] font-display italic"
          style={{
            color: "#1C1A17",
            fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
            lineHeight: 1.5,
            fontWeight: 300,
          }}
        >
          Whatever you&rsquo;re carrying, whatever you&rsquo;ve been through — there&rsquo;s a
          place for you here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
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

      <style jsx>{`
        .goodbye-face {
          animation: goodbye-breath 5.6s ease-in-out infinite;
        }
        @keyframes goodbye-breath {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .goodbye-face { animation: none; }
        }
      `}</style>
    </section>
  );
}
