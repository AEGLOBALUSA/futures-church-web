"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type FAQItem = { q: string; a: string };

type SelahData = {
  faq: FAQItem[];
};

const LAUNCH_DATE = new Date("2026-05-15T00:00:00Z");

const CHIPS = [
  "what are the three voices?",
  "is Selah a therapist?",
  "what does a Selah conversation feel like?",
  "how much will Selah cost?",
  "when does Selah launch?",
  "why Futures built Selah",
];

const TRUSTED_CORPUS = [
  {
    name: "Matthew Henry",
    era: "Historic",
    strength: "Whole-Bible commentary. Devotional warmth anchored in close reading.",
  },
  {
    name: "ESV Study Bible",
    era: "Contemporary",
    strength: "Evangelical consensus notes. Dependable cross-references and context.",
  },
  {
    name: "John Stott",
    era: "Modern",
    strength: "Biblical exposition. Clarity on the cross, discipleship, the church.",
  },
  {
    name: "N.T. Wright",
    era: "Contemporary",
    strength: "Kingdom, resurrection, and the story of God. Deep New Testament scholarship.",
  },
  {
    name: "Eugene Peterson",
    era: "Modern",
    strength: "Pastoral theology. The long obedience, prayer, and a shepherd's ear.",
  },
];

export function SelahPageClient({ data }: { data: SelahData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("selah"), [setPageContext]);

  return (
    <main className="bg-ink-900 text-cream">
      <SelahHero />
      <WhatSelahIs />
      <TrustedCorpus />
      <TryAQuestion />
      <WhoItsForAndIsnt />
      <PrivacyPromise />
      <FoundingMemberOffer />
      <SelahFAQ items={data.faq} />
      <AshleysMessage />
      <FinalInvitation />
    </main>
  );
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function SelahHero() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
  return (
    <section className="relative flex min-h-[96vh] items-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(204,143,74,0.18) 0%, rgba(20,18,16,0) 60%), linear-gradient(180deg, #0E0C0A 0%, #141210 100%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=2000&q=80&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="relative mx-auto w-full max-w-[1200px] px-6 py-24 sm:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-warm-500">
          SELAH &middot; COMING MAY 15, 2026
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6 font-display"
          style={{
            fontSize: "clamp(3rem,9vw,8rem)",
            fontWeight: 300,
            lineHeight: 0.94,
            letterSpacing: "-0.025em",
          }}
        >
          Three voices. <em className="italic">Scripture</em> first.<br />
          For the questions you can&rsquo;t <em className="italic">google</em>.
        </motion.h1>
        <p className="mt-8 max-w-[52ch] font-body text-[18px] leading-relaxed text-cream/75">
          A pastoral companion for your hardest questions. Three voices &mdash; Prophet, Pastor, Strategist &mdash; that speak from Scripture before they speak from anywhere else. Grounded in the church&rsquo;s most trusted teachers.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <CountdownGrid d={days} h={hours} m={minutes} s={seconds} />
          <a
            href="#founding"
            className="inline-flex items-center gap-2 rounded-full bg-warm-500 px-7 py-3.5 font-ui text-[14px] font-medium text-ink-900 transition-transform hover:-translate-y-0.5"
          >
            Save my seat &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

function CountdownGrid({ d, h, m, s }: { d: number; h: number; m: number; s: number }) {
  const cells = [
    { v: d, l: "days" },
    { v: h, l: "hrs" },
    { v: m, l: "min" },
    { v: s, l: "sec" },
  ];
  return (
    <div className="flex items-end gap-3">
      {cells.map((c) => (
        <div key={c.l} className="flex flex-col items-center">
          <span
            className="font-display text-cream"
            style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 300, lineHeight: 1 }}
          >
            {String(c.v).padStart(2, "0")}
          </span>
          <span className="mt-1 font-ui text-[10px] uppercase tracking-[0.24em] text-cream/50">
            {c.l}
          </span>
        </div>
      ))}
    </div>
  );
}

function WhatSelahIs() {
  const cards = [
    {
      t: "A companion, not a replacement",
      b: "Your pastor, your therapist, your GP still matter. Selah sits alongside them for the hours between.",
    },
    {
      t: "Three voices, one Selah",
      b: "Prophet speaks truth. Pastor brings comfort. Strategist offers wisdom for what&rsquo;s next. One conversation, the voice the moment needs.",
    },
    {
      t: "On your worst night, too",
      b: "Three in the morning. In the hospital car park. After the call. Selah is there when a human can&rsquo;t be.",
    },
  ];
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Eyebrow>WHAT SELAH IS</Eyebrow>
        <h2
          className="mt-3 font-display text-cream"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Not a chatbot. A <em className="italic">conversation</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <GlassCard key={c.t} dark className="p-7">
              <p className="font-display italic text-cream" style={{ fontSize: 24, fontWeight: 300 }}>
                {c.t}
              </p>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-cream/70" dangerouslySetInnerHTML={{ __html: c.b }} />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustedCorpus() {
  const voices = [
    {
      key: "Prophet",
      tagline: "Speaks truth.",
      body: "When the answer is a hard one. Drift, compromise, the thing you&rsquo;ve tolerated too long. Scripture with a backbone.",
    },
    {
      key: "Pastor",
      tagline: "Brings comfort.",
      body: "When the night is long. Grief, doubt, burnout, shame. Scripture read like a father reading to a tired child.",
    },
    {
      key: "Strategist",
      tagline: "Offers wisdom for what&rsquo;s next.",
      body: "When the question is a decision. Plants, pipelines, succession, the hire. Kingdom strategy, not career coaching.",
    },
  ];

  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#12100E" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>HOW SELAH WORKS</Eyebrow>
        <h2
          className="mt-3 font-display text-cream"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Three voices. <em className="italic">One Selah</em>.
        </h2>
        <p className="mt-3 max-w-[56ch] font-body text-[15px] text-cream/60">
          Selah hears your question and picks the voice &mdash; or two voices, or all three &mdash; that the moment needs. Scripture is always first. Commentary follows.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {voices.map((v) => (
            <GlassCard key={v.key} dark className="p-7">
              <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-warm-500">
                {v.key}
              </p>
              <p
                className="mt-3 font-display italic text-cream"
                style={{ fontSize: 22, fontWeight: 300 }}
              >
                {v.tagline}
              </p>
              <p
                className="mt-4 font-body text-[15px] leading-relaxed text-cream/70"
                dangerouslySetInnerHTML={{ __html: v.body }}
              />
            </GlassCard>
          ))}
        </div>

        <div className="mt-20">
          <Eyebrow>THE CORPUS</Eyebrow>
          <h3
            className="mt-3 font-display text-cream"
            style={{ fontSize: "clamp(1.75rem,3.6vw,2.25rem)", fontWeight: 300, lineHeight: 1.05 }}
          >
            The teachers Selah <em className="italic">leans on</em>.
          </h3>
          <p className="mt-3 max-w-[56ch] font-body text-[15px] text-cream/60">
            A small, trusted set. Not every voice in church history &mdash; the ones Selah defers to when Scripture has been faithfully opened for centuries.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRUSTED_CORPUS.map((s) => (
              <div
                key={s.name}
                className="rounded-xl border border-warm-500/25 bg-warm-500/[0.06] p-5"
              >
                <p
                  className="font-display text-cream"
                  style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.15 }}
                >
                  {s.name}
                </p>
                <p className="mt-2 font-ui text-[10px] uppercase tracking-[0.22em] text-warm-500">
                  {s.era}
                </p>
                <p className="mt-3 font-body text-[13px] leading-relaxed text-cream/65">
                  {s.strength}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 font-ui text-[11px] uppercase tracking-[0.24em] text-cream/40">
            100+ seeded scenarios for members and pastors &middot; Scripture first, always
          </p>
        </div>
      </div>
    </section>
  );
}

type DemoMsg = { id: string; role: "user" | "assistant"; content: string };

function TryAQuestion() {
  const [messages, setMessages] = useState<DemoMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const seeds = [
    "I can&rsquo;t sleep. My mind won&rsquo;t stop.",
    "How do I pray when I don&rsquo;t feel God?",
    "I&rsquo;m angry at my dad and I don&rsquo;t want to be.",
    "Is it okay to doubt?",
  ];

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    const userMsg: DemoMsg = { id: `u-${Date.now()}`, role: "user", content: text };
    const assistantId = `a-${Date.now()}`;
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/selah/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error("demo failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Something went quiet. Try again in a moment." }
            : m
        )
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[820px]">
        <Eyebrow>TRY A QUESTION</Eyebrow>
        <h2
          className="mt-3 font-display text-cream"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Ask Selah <em className="italic">anything</em>.
        </h2>
        <p className="mt-3 max-w-[52ch] font-body text-[15px] text-cream/60">
          A live preview of the Selah app. Bring something real &mdash; prayer, grief, doubt, a stuck thought.
        </p>

        <GlassCard dark breathe className="mt-8 p-6">
          <div
            ref={scrollerRef}
            className="max-h-[360px] min-h-[120px] space-y-4 overflow-y-auto pr-2"
          >
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {seeds.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s.replace(/&rsquo;/g, "\u2019"))}
                    className="rounded-full border border-cream/15 bg-black/20 px-4 py-2 font-body text-[13px] text-cream/75 transition-colors hover:border-warm-500 hover:text-cream"
                    dangerouslySetInnerHTML={{ __html: s }}
                  />
                ))}
              </div>
            )}
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-warm-500 px-4 py-2.5 font-body text-[14px] text-ink-900">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex">
                  <div
                    className="max-w-[92%] rounded-2xl border-l-[3px] border-warm-500 bg-black/30 px-5 py-4 font-body text-[15px] leading-relaxed text-cream/90"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(180deg, transparent 0 26px, rgba(255,252,247,0.04) 26px 27px)",
                    }}
                  >
                    {m.content || <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-warm-500" />}
                  </div>
                </div>
              )
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mt-5 flex items-center gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What&rsquo;s on your heart tonight?"
              className="h-12 flex-1 rounded-full border border-cream/10 bg-black/30 px-5 font-body text-[15px] text-cream placeholder:text-cream/40 focus:border-warm-500 focus:outline-none"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="h-12 rounded-full bg-warm-500 px-6 font-ui text-[13px] font-medium text-ink-900 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {busy ? "…" : "Send"}
            </button>
          </form>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-cream/10 bg-black/20 px-3 py-2.5">
            <span className="mt-[2px] font-ui text-[10px] uppercase tracking-[0.22em] text-warm-500">
              Private
            </span>
            <p className="font-body text-[12px] leading-relaxed text-cream/70">
              These conversations aren&rsquo;t stored, logged, or read by anyone. Not us. Not ever. When you close this tab, what you said is gone.
            </p>
          </div>
          <p className="mt-3 font-ui text-[10px] uppercase tracking-[0.2em] text-cream/35">
            Demo only &middot; not a substitute for professional care
          </p>
        </GlassCard>

        <div className="mt-6">
          <AIInput
            placeholder="Ask about Selah itself&hellip;"
            chips={CHIPS}
            compact
          />
        </div>
      </div>
    </section>
  );
}

function WhoItsForAndIsnt() {
  const forList = [
    "The parent at 11pm trying to pray after a hard day.",
    "The leader carrying things they can&rsquo;t say out loud.",
    "The teenager with a question their friends can&rsquo;t answer.",
    "The grieving, the doubting, the burned-out.",
  ];
  const notList = [
    "A replacement for a qualified therapist.",
    "A prescriber &mdash; Selah will not give medical advice.",
    "A shortcut around your local church.",
    "An emergency line &mdash; crises go to 988 or 13 11 14.",
  ];
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#0E0C0A" }}>
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>WHO IT&rsquo;S FOR</Eyebrow>
          <h3
            className="mt-3 font-display text-cream"
            style={{ fontSize: "clamp(1.75rem,3.6vw,2.25rem)", fontWeight: 300, lineHeight: 1.05 }}
          >
            The in-between <em className="italic">hours</em>.
          </h3>
          <ul className="mt-6 space-y-3">
            {forList.map((t) => (
              <li key={t} className="flex items-start gap-3 font-body text-[15px] text-cream/80">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warm-500" />
                <span dangerouslySetInnerHTML={{ __html: t }} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Eyebrow>WHAT IT ISN&rsquo;T</Eyebrow>
          <h3
            className="mt-3 font-display text-cream"
            style={{ fontSize: "clamp(1.75rem,3.6vw,2.25rem)", fontWeight: 300, lineHeight: 1.05 }}
          >
            A <em className="italic">substitute</em> for a human.
          </h3>
          <ul className="mt-6 space-y-3">
            {notList.map((t) => (
              <li key={t} className="flex items-start gap-3 font-body text-[15px] text-cream/70">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cream/30" />
                <span dangerouslySetInnerHTML={{ __html: t }} />
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-warm-500/30 bg-warm-500/10 p-5">
            <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-500">
              IN CRISIS
            </p>
            <p className="mt-2 font-body text-[14px] leading-relaxed text-cream/85">
              United States: call or text <strong>988</strong>.<br />
              Australia: Lifeline <strong>13 11 14</strong>.<br />
              Elsewhere: your local emergency number.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyPromise() {
  const lines = [
    {
      k: "Not stored.",
      v: "Conversations live only in your active session. Close the tab and they&rsquo;re gone.",
    },
    {
      k: "Not logged.",
      v: "We don&rsquo;t write transcripts to any database, log file, or analytics event.",
    },
    {
      k: "Not read.",
      v: "No moderator, no pastor, no staff member ever sees what you say to Selah. Not us. Not ever.",
    },
  ];
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#12100E" }}>
      <div className="mx-auto max-w-[900px]">
        <Eyebrow>PRIVACY</Eyebrow>
        <h2
          className="mt-3 font-display text-cream"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          What you say here <em className="italic">stays here</em>.
        </h2>
        <p className="mt-3 max-w-[56ch] font-body text-[15px] text-cream/60">
          Selah is a confessional space, not a monitored one. We designed it so no human ever has to.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {lines.map((l) => (
            <div
              key={l.k}
              className="rounded-xl border border-warm-500/25 bg-warm-500/[0.06] p-6"
            >
              <p
                className="font-display italic text-cream"
                style={{ fontSize: 22, fontWeight: 300 }}
              >
                {l.k}
              </p>
              <p
                className="mt-3 font-body text-[14px] leading-relaxed text-cream/70"
                dangerouslySetInnerHTML={{ __html: l.v }}
              />
            </div>
          ))}
        </div>
        <p className="mt-8 font-ui text-[11px] uppercase tracking-[0.24em] text-cream/40">
          Full details in the <a href="/privacy" className="text-warm-500 underline-offset-4 hover:underline">privacy policy</a>
          {" "}&middot;{" "}
          <a href="/terms" className="text-warm-500 underline-offset-4 hover:underline">terms</a>
        </p>
      </div>
    </section>
  );
}

function FoundingMemberOffer() {
  return (
    <section id="founding" className="px-6 py-24 sm:px-10" style={{ background: "#141210" }}>
      <div className="mx-auto max-w-[720px]">
        <Eyebrow>FOUNDING MEMBERS</Eyebrow>
        <h2
          className="mt-3 font-display text-cream"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Be one of the <em className="italic">first thousand</em>.
        </h2>
        <p className="mt-4 max-w-[52ch] font-body text-[16px] text-cream/70">
          Lifetime pricing locked in. Early features. A monthly Q&amp;A with Ashley and the team. First seats in Selah Circles when they open.
        </p>
        <div className="mt-10">
          <ValueExchangeForm
            source="selah-founding"
            dark
            offer="Join the founding list. Lock in lifetime pricing and a seat at the first Q&A."
            proofPoints={[
              "Lifetime founding-member pricing",
              "Early access before May 15",
              "Monthly Q&A with the team",
            ]}
            fields={["email", "name", "oneThing"]}
            cta="Save my seat"
            outcome="You&rsquo;re in. We&rsquo;ll send the founding-member welcome this week."
          />
        </div>
      </div>
    </section>
  );
}

function SelahFAQ({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[820px]">
        <Eyebrow>QUESTIONS</Eyebrow>
        <h2
          className="mt-3 font-display text-cream"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          The ones we get <em className="italic">most</em>.
        </h2>
        <div className="mt-10 divide-y divide-cream/10 border-y border-cream/10">
          {items.map((it, i) => {
            const open = openIdx === i;
            return (
              <div key={it.q}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span
                    className="font-display italic text-cream"
                    style={{ fontSize: 20, fontWeight: 300 }}
                  >
                    {it.q}
                  </span>
                  <span className="font-ui text-[18px] text-warm-500">
                    {open ? "\u2212" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 font-body text-[15px] leading-relaxed text-cream/75">
                        {it.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AshleysMessage() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#12100E" }}>
      <div className="mx-auto max-w-[860px]">
        <Eyebrow>A NOTE FROM ASHLEY</Eyebrow>
        <h2
          className="mt-3 font-display text-cream"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          Why we <em className="italic">built this</em>.
        </h2>
        <div
          className="mt-8 flex aspect-video items-center justify-center rounded-[22px] border border-cream/10 bg-black/40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(204,143,74,0.14) 0%, transparent 70%)",
          }}
        >
          <button
            type="button"
            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-warm-500 bg-ink-900/60 text-cream transition-transform hover:scale-105"
            aria-label="Play Ashley's message"
          >
            <span className="ml-1 text-2xl">&#9654;</span>
          </button>
        </div>
        <p className="mt-5 font-body text-[14px] text-cream/55">
          Two minutes with Ashley Evans, Global Senior Pastor. Video uploading soon.
        </p>
      </div>
    </section>
  );
}

function FinalInvitation() {
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#0E0C0A" }}>
      <div className="mx-auto max-w-[820px] text-center">
        <h2
          className="font-display text-cream"
          style={{ fontSize: "clamp(2.25rem,5.6vw,4rem)", fontWeight: 300, lineHeight: 1 }}
        >
          You don&rsquo;t have to figure it out <em className="italic">alone</em>.
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] font-body text-[17px] leading-relaxed text-cream/70">
          Selah launches May 15, 2026. Save your seat, lock in founding pricing, and be here when we open the doors.
        </p>
        <a
          href="#founding"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-warm-500 px-8 py-4 font-ui text-[14px] font-medium text-ink-900 transition-transform hover:-translate-y-0.5"
        >
          Save my seat &rarr;
        </a>
      </div>
    </section>
  );
}
