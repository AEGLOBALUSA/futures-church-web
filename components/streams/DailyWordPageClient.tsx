"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow, Hero, Sub } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type DailyWordData = {
  today: {
    date: string;
    scripture: { text: string; reference: string };
    reflection: string;
    question: string;
  };
  archive: { date: string; reference: string; preview: string }[];
  subscriberCount: number;
};

const CHIPS = [
  "what's today's word?",
  "I need encouragement for today",
  "give me a verse about peace",
  "help me memorize this week's scripture",
  "send me today's reflection",
  "what was last Sunday's sermon scripture?",
];

function useAutoTimezone() {
  const [tz, setTz] = useState<string>("");
  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {}
  }, []);
  return tz;
}

function formatToday(iso: string) {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function DailyWordPageClient({ data }: { data: DailyWordData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("daily-word"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <DailyWordHero />
      <TodaysWord today={data.today} />
      <SignupBlock position="top" />
      <ThirtyDayArchive items={data.archive.slice(0, 30)} />
      <SubscriberProof count={data.subscriberCount} />
      <SignupBlock position="bottom" />
    </main>
  );
}

function DailyWordHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 80% 0%, #F2E6D1 0%, #FDFBF6 50%, #FDFBF6 100%)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
        <Eyebrow>DAILY WORD &middot; EVERY MORNING 5AM</Eyebrow>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 max-w-[18ch]"
        >
          <Hero>
            One word. One breath. <em className="italic">One day</em>.
          </Hero>
        </motion.div>
        <Sub className="mt-6 max-w-[52ch]">
          A scripture, a reflection, a question to carry &mdash; delivered to your inbox at 5am
          your time.
        </Sub>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-6">
            <AIInput placeholder="Ask Ezra anything about today's word&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function TodaysWord({ today }: { today: DailyWordData["today"] }) {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[780px]">
        <GlassCard className="p-8 sm:p-10">
          <Eyebrow>TODAY &middot; {formatToday(today.date)}</Eyebrow>
          <blockquote
            className="my-6 font-display italic text-ink-900"
            style={{ fontSize: "clamp(24px, 3.2vw, 32px)", lineHeight: 1.25, fontWeight: 300 }}
          >
            &ldquo;{today.scripture.text}&rdquo;
          </blockquote>
          <p className="mb-8 font-ui text-[13px] uppercase tracking-[0.2em] text-ink-600">
            &mdash; {today.scripture.reference}
          </p>
          <p className="font-body text-ink-900" style={{ fontSize: 17, lineHeight: 1.65 }}>
            {today.reflection}
          </p>
          <div className="mt-8 border-t border-ink-900/10 pt-6">
            <p className="font-display italic text-warm-700" style={{ fontSize: 18, fontWeight: 400 }}>
              to carry today:{" "}
              <span className="text-ink-900">{today.question}</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function SignupBlock({ position }: { position: "top" | "mid" | "bottom" }) {
  const tz = useAutoTimezone();
  const copy = {
    top: {
      offer: "Get tomorrow's word at 5am, your time.",
      proof: [
        "300,000+ people wake up to this",
        "Hand-crafted by our pastors",
        "Unsubscribe anytime",
      ],
      cta: "Send me tomorrow's word",
      outcome: "Check your inbox at 5am your time.",
      source: "daily-word-top",
    },
    mid: {
      offer: "Start tomorrow with scripture waiting for you.",
      proof: ["90-second reflection", "One question to carry", "Always free"],
      cta: "Start tomorrow",
      outcome: "You'll hear from us before sunrise.",
      source: "daily-word-mid",
    },
    bottom: {
      offer: "Join 300,000 mornings.",
      proof: undefined,
      cta: "Count me in",
      outcome: "Tomorrow morning. 5am. Your inbox.",
      source: "daily-word-bottom",
    },
  }[position];

  return (
    <section className="px-6 py-16 sm:px-10" style={{ background: position === "mid" ? "#F7F1E6" : "transparent" }}>
      <div className="mx-auto max-w-[560px]">
        <ValueExchangeForm
          source={copy.source}
          offer={copy.offer}
          proofPoints={copy.proof}
          fields={["email", "timezone"]}
          cta={copy.cta}
          outcome={copy.outcome}
          key={`vex-${position}-${tz}`}
        />
        {tz && (
          <p className="mt-3 text-center font-ui text-[12px] text-ink-600">
            Timezone auto-detected: <span className="text-ink-900">{tz}</span> &middot; you can change it above.
          </p>
        )}
      </div>
    </section>
  );
}

function ThirtyDayArchive({ items }: { items: DailyWordData["archive"] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[780px]">
        <Eyebrow>LAST 30 DAYS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          Yesterday&rsquo;s still <em className="italic">here</em>.
        </h2>
        <ul className="mt-10 divide-y divide-ink-900/10 rounded-[22px] bg-white/70 shadow-[0_18px_40px_-28px_rgba(20,20,20,0.25)]">
          {items.map((e, i) => {
            const open = openIdx === i;
            return (
              <li key={e.date}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  aria-expanded={open}
                >
                  <div className="flex min-w-0 flex-1 items-baseline gap-4">
                    <span className="flex-shrink-0 font-ui text-[12px] uppercase tracking-[0.18em] text-ink-600">
                      {formatToday(e.date)}
                    </span>
                    <span className="flex-shrink-0 font-ui text-[12px] text-warm-700">
                      {e.reference}
                    </span>
                    <span className="truncate font-body text-[14px] text-ink-900">
                      {e.preview}
                    </span>
                  </div>
                  <span className={`font-ui text-[14px] text-ink-600 transition-transform ${open ? "rotate-90" : ""}`}>&rsaquo;</span>
                </button>
                {open && (
                  <div className="px-6 pb-5 font-body text-[14px] leading-relaxed text-ink-600">
                    <p>{e.preview}</p>
                    <p className="mt-3 font-ui text-[12px] text-ink-600/70">
                      Full reflection archive lives at{" "}
                      <a
                        className="underline underline-offset-2 hover:text-warm-700"
                        href="https://futuresdailyword.com/archive"
                        target="_blank"
                        rel="noreferrer"
                      >
                        futuresdailyword.com/archive
                      </a>
                      .
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-8 text-center">
          <Link
            href="https://futuresdailyword.com/archive"
            className="font-ui text-[14px] text-warm-700 hover:underline"
          >
            Read all past words &rarr;
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-20 max-w-[560px]">
        <SignupBlockInner position="mid" />
      </div>
    </section>
  );
}

function SignupBlockInner({ position }: { position: "mid" }) {
  const tz = useAutoTimezone();
  return (
    <>
      <ValueExchangeForm
        source="daily-word-mid"
        offer="Start tomorrow with scripture waiting for you."
        proofPoints={["90-second reflection", "One question to carry", "Always free"]}
        fields={["email", "timezone"]}
        cta="Start tomorrow"
        outcome="You'll hear from us before sunrise."
      />
      {tz && (
        <p className="mt-3 text-center font-ui text-[12px] text-ink-600">
          Timezone auto-detected: <span className="text-ink-900">{tz}</span>
        </p>
      )}
    </>
  );
}

function SubscriberProof({ count }: { count: number }) {
  return (
    <section className="px-6 py-20 text-center sm:px-10">
      <div className="mx-auto max-w-[720px]">
        <p
          className="font-display italic text-ink-900"
          style={{ fontSize: "clamp(28px,4.2vw,44px)", fontWeight: 300, lineHeight: 1.15 }}
        >
          {Intl.NumberFormat().format(count)}+ <em className="italic">start their day</em> here.
        </p>
        <p className="mt-5 font-body text-[16px] text-ink-600">
          Students in Adelaide. Moms in Atlanta. Surfers in Bali. Grandparents in Solo. One scripture.
          One breath. One day.
        </p>
      </div>
    </section>
  );
}
