"use client";

import { useEffect, useState } from "react";
import { formatCountdown, SELAH_LAUNCH_DATE } from "@/lib/utils";
import { EmailCapture } from "@/components/ui/EmailCapture";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function SelahCountdown() {
  const [countdown, setCountdown] = useState(() => formatCountdown(SELAH_LAUNCH_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatCountdown(SELAH_LAUNCH_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 md:py-40 bg-pink grain-overlay overflow-hidden relative">
      <div
        aria-hidden
        className="aurora-blob bg-violet"
        style={{ top: "-30%", left: "-10%", width: "55vw", height: "55vw" }}
      />
      <div
        aria-hidden
        className="aurora-blob bg-lemon"
        style={{ bottom: "-30%", right: "-10%", width: "50vw", height: "50vw", opacity: 0.4, animationDelay: "-8s" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 lg:px-14 text-center">
        <ScrollReveal>
          <p className="section-label text-bone/80 mb-6">07 // COMING MAY 15, 2026</p>
          <h2
            className="font-display text-bone mb-6 leading-[0.88]"
            style={{ fontSize: "clamp(4rem, 11vw, 10rem)", fontWeight: 300 }}
          >
            <em className="not-italic">Selah</em>
          </h2>
          <p className="font-sans text-bone/85 max-w-xl mx-auto mb-14" style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)", lineHeight: 1.55 }}>
            500+ theologians, psychologists, psychiatrists, philosophers, and therapists — all sharing a biblical worldview — in one app. Pastoral counsel and daily help, on demand.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {countdown.expired ? (
            <p className="font-display text-4xl text-lemon mb-14" style={{ fontWeight: 300 }}>Available now.</p>
          ) : (
            <div className="flex justify-center gap-3 md:gap-8 mb-14">
              {[
                { v: countdown.days, label: "Days" },
                { v: countdown.hours, label: "Hours" },
                { v: countdown.minutes, label: "Min" },
                { v: countdown.seconds, label: "Sec" },
              ].map(({ v, label }) => (
                <div key={label} className="text-center min-w-[70px]">
                  <p
                    className="font-display text-lemon tabular-nums leading-none"
                    style={{ fontSize: "clamp(2.75rem, 6vw, 5.5rem)", fontWeight: 300 }}
                  >
                    {String(v).padStart(2, "0")}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-bone/60 mt-2">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="max-w-md mx-auto">
            <p className="text-sm text-bone/75 font-sans mb-4">
              Join the founding list — first access + founding member pricing locked for life.
            </p>
            <EmailCapture
              source="selah-waitlist"
              interests={["selah"]}
              placeholder="Your email for early access"
              ctaText="Get early access"
              successMessage="You're on the founding list. We'll be in touch soon."
              variant="glass"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
