"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { SlotEditor } from "@/components/edit/SlotEditor";

type DreamersData = {
  reel: string[];
  tiles: { slug: string; title: string; when: string; photo: string; blurb: string }[];
  leaders: { name: string; campus: string; photo: string; oneLine: string }[];
  parentFacts: { title: string; body: string }[];
};

const CHIPS = [
  "when does Dreamers meet?",
  "is Dreamers at my campus?",
  "when's the next camp?",
  "I'm a parent — what should I know?",
  "how do I volunteer with Dreamers?",
  "is there a Dreamers leader near me?",
];

export function DreamersPageClient({ data }: { data: DreamersData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("dreamers"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <DreamersHero reel={data.reel} />
      <DreamersWhatHappens tiles={data.tiles} />
      <DreamersByCampus leaders={data.leaders} />
      <DreamersDiscord />
      <ParentInfoSection facts={data.parentFacts} />
      <DreamersValueExchange />
    </main>
  );
}

function DreamersHero({ reel }: { reel: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % reel.length), 6000);
    return () => clearInterval(id);
  }, [reel.length]);

  return (
    <section className="relative h-[min(100dvh,900px)] min-h-[620px] overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={reel[idx]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={reel[idx]}
            alt=""
            fill
            unoptimized
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(20,18,16,0.35) 0%, rgba(20,18,16,0.65) 100%)" }}
      />
      <div className="relative mx-auto flex h-full max-w-[1440px] items-end px-6 pb-16 pt-28 sm:px-10">
        <div className="max-w-[680px] text-cream">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-cream/80">
            DREAMERS &middot; THE NEXT GENERATION
          </p>
          <SlotEditor id="dreamers.intro.headline" as="h1">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-4 font-display"
              style={{
                fontSize: "clamp(2.75rem,7vw,6rem)",
                fontWeight: 300,
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              For the generation that&rsquo;s about to <em className="italic">change everything</em>.
            </motion.h1>
          </SlotEditor>
          <SlotEditor id="dreamers.intro.body">
            <p className="mt-6 max-w-[46ch] font-body text-[17px] leading-relaxed text-cream/85">
              Friday nights, summer camps, and mentors who stay in the room.
            </p>
          </SlotEditor>
          <div className="mt-8 max-w-[560px]">
            <GlassCard dark breathe className="p-5">
              <AIInput placeholder="Ask a Dreamers question&hellip;" chips={CHIPS} compact />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function DreamersWhatHappens({ tiles }: { tiles: DreamersData["tiles"] }) {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>WHAT HAPPENS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Weekly. Camps. <em className="italic">Retreats</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiles.map((t) => (
            <article
              key={t.slug}
              className="overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_-22px_rgba(20,20,20,0.3)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image src={t.photo} alt={t.title} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="font-display italic text-ink-900" style={{ fontSize: 24, fontWeight: 300 }}>
                  {t.title}
                </p>
                <p
                  className="mt-1 font-ui text-[12px] uppercase tracking-[0.2em] text-warm-700"
                  dangerouslySetInnerHTML={{ __html: t.when }}
                />
                <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-600">
                  {t.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DreamersByCampus({ leaders }: { leaders: DreamersData["leaders"] }) {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>YOUTH PASTORS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Mentors <em className="italic">by name</em>.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3">
          {leaders.map((l) => (
            <div
              key={`${l.name}-${l.campus}`}
              className="overflow-hidden rounded-[20px] bg-white shadow-[0_14px_34px_-22px_rgba(20,20,20,0.25)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image src={l.photo} alt={l.name} fill unoptimized sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="font-display italic text-ink-900" style={{ fontSize: 19, fontWeight: 300 }}>
                  {l.name}
                </p>
                <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">
                  {l.campus}
                </p>
                <p className="mt-3 font-body text-[13px] text-ink-600">{l.oneLine}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DreamersDiscord() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[780px] text-center">
        <Eyebrow>DREAMERS DISCORD</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          The group chat that <em className="italic">never sleeps</em>.
        </h2>
        <p className="mt-5 font-body text-[16px] text-ink-600">
          Banter, prayer requests, memes, Friday-night plans. Moderated by leaders, safe for everyone.
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("futures:open-dock"))}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[14px] text-cream transition-transform hover:-translate-y-0.5"
        >
          Request an invite &rarr;
        </button>
      </div>
    </section>
  );
}

function ParentInfoSection({ facts }: { facts: DreamersData["parentFacts"] }) {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1100px]">
        <Eyebrow>FOR PARENTS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Four things we want you to <em className="italic">know</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {facts.map((f) => (
            <GlassCard key={f.title} className="p-6">
              <p className="font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>
                {f.title}
              </p>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-600">
                {f.body}
              </p>
            </GlassCard>
          ))}
        </div>
        <p className="mt-10 text-center">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("futures:open-dock"))}
            className="font-ui text-[14px] text-warm-700 hover:underline"
          >
            Ask a parent question &rarr;
          </button>
        </p>
      </div>
    </section>
  );
}

function DreamersValueExchange() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[560px]">
        <ValueExchangeForm
          source="dreamers-mentor"
          offer="One short mentor message every month. Real voices, real stories, no spam."
          proofPoints={["Age-appropriate by birth year", "One message a month", "Dreamers events first"]}
          fields={["email", "birthYear"]}
          cta="Sign me up"
          outcome="Next mentor message lands in your inbox on the 1st."
        />
      </div>
    </section>
  );
}
