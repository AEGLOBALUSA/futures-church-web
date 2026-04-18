"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Bookmark } from "lucide-react";
import { campuses, type CampusRegion } from "@/lib/content/campuses";
import { CountryView } from "./CountryView";

// Dynamic — cobe uses WebGL, skip server render. Placeholder keeps the slot warm.
const Globe = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
});

function GlobePlaceholder() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[780px]">
      <div
        className="globe-placeholder absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 32%, #FAE8D2 0%, #E8C9A6 45%, #C8906B 100%)",
          boxShadow:
            "0 40px 80px -30px rgba(200,144,107,0.45), inset -40px -50px 100px -20px rgba(140, 92, 58, 0.35), inset 30px 30px 80px -10px rgba(255,252,247,0.5)",
        }}
        aria-hidden
      />
      <style jsx>{`
        .globe-placeholder {
          animation: globe-breathe 4s ease-in-out infinite;
        }
        @keyframes globe-breathe {
          0%, 100% { transform: scale(1); opacity: 0.92; }
          50%      { transform: scale(1.012); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .globe-placeholder { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

// Hero B-roll — human, warm, ambient. Swap these URLs for real Futures Sunday clips
// when Hannah cuts them. Each still gets a 14s Ken-Burns zoom + cross-dissolves with its neighbours.
// Sourced from Unsplash (free, hotlink-allowed).
const HERO_FRAMES = [
  {
    url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1800&q=75&auto=format&fit=crop",
    alt: "Hands raised in warm sanctuary light",
  },
  {
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1800&q=75&auto=format&fit=crop",
    alt: "Friends laughing around a table",
  },
  {
    url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1800&q=75&auto=format&fit=crop",
    alt: "Family walking together at golden hour",
  },
  {
    url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1800&q=75&auto=format&fit=crop",
    alt: "Worship gathering at dusk",
  },
];

// Context-aware preset chips — the journey speaks differently at each level.
const CHIPS_BY_LEVEL: Record<string, string[]> = {
  globe: [
    "find my closest campus",
    "where's the nearest Spanish-language church?",
    "show me where we meet online",
    "which campus is launching next?",
    "I'm traveling — can I visit a Futures campus?",
    "meet Ashley & Jane Evans",
  ],
  australia: [
    "which campus is closest to my city?",
    "which one meets closest to Adelaide?",
    "I prefer a smaller campus",
    "which one has the most kids ministry?",
    "show me the newest campus here",
    "tell me about Ps Josh & Sjhana",
  ],
  usa: [
    "which campus is closest to my city?",
    "which Futuros (Spanish) campus is closest?",
    "show me the Tennessee campus",
    "which Georgia campus should I visit first?",
    "can I meet Ashley & Jane Evans?",
    "what about my kids on a Sunday?",
  ],
  indonesia: [
    "which campus is closest to my city?",
    "tell me about our Bali campus",
    "which campus is in Central Java?",
    "what language are the services in?",
    "meet Ps Adi & Lala in Solo",
    "is there a kids program?",
  ],
  venezuela: [
    "when does Caracas launch?",
    "how can I get involved?",
    "which city launches first?",
    "can I give toward Venezuela?",
    "who are the launch pastors?",
    "tell me the story of these four campuses",
  ],
  global: [
    "when do services stream?",
    "how do I join online community?",
    "is there live prayer?",
    "can I watch past services?",
    "how do I give online?",
    "where are you in the world?",
  ],
};

// Country camera focus centroids (approx center of active campuses per region).
const COUNTRY_FOCUS: Record<CampusRegion, { lat: number; lng: number } | null> = {
  australia: { lat: -34, lng: 138 },
  usa: { lat: 35, lng: -85 },
  indonesia: { lat: -4, lng: 116 },
  venezuela: { lat: 9, lng: -68 },
  global: null,
};

const VALID_REGIONS: CampusRegion[] = [
  "australia",
  "usa",
  "indonesia",
  "venezuela",
  "global",
];

// People row — real campus pastors. Rotate weekly across the pastor pool.
const PEOPLE_ROW = [
  { name: "Ashley", caption: "Global Senior", hue: "#C45236" },
  { name: "Jane", caption: "Global Senior", hue: "#8A5A3C" },
  { name: "Josh", caption: "Australia Lead", hue: "#C8906B" },
  { name: "Sjhana", caption: "Australia Lead", hue: "#AC9B25" },
];

type Msg = { id: string; role: "user" | "assistant"; content: string };

function uuid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function CampusesHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");
  const activeRegion: CampusRegion | null =
    countryParam && (VALID_REGIONS as string[]).includes(countryParam)
      ? (countryParam as CampusRegion)
      : null;
  const level: keyof typeof CHIPS_BY_LEVEL = activeRegion ?? "globe";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const sessionId = useRef(uuid());
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const globeFocus = activeRegion ? COUNTRY_FOCUS[activeRegion] : null;
  const globeScale = activeRegion ? 0.75 : 1;

  function handleDotClick(slug: string) {
    const campus = campuses.find((c) => c.slug === slug);
    if (!campus) return;
    // Click a dot at any level → zoom camera to the campus's country.
    router.push(`/campuses?country=${campus.region}`, { scroll: false });
  }

  // Cursor-aware tilt (max 2°, disabled on reduced-motion via Framer's respectReducedMotion).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [2, -2]), { stiffness: 80, damping: 18 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-2, 2]), { stiffness: 80, damping: 18 });

  function handleCardMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleCardMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: Msg = { id: uuid(), role: "user", content: trimmed };
    const assistantId = uuid();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    setShowFollowUps(false);

    try {
      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, model: "claude", sessionId: sessionId.current }),
      });
      if (!res.ok || !res.body) throw new Error("stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data) as { token?: string };
            if (parsed.token) {
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + parsed.token } : m))
              );
            }
          } catch {
            /* ignore partial-chunk parse errors */
          }
        }
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setStreaming(false);
      setShowFollowUps(true);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleChip(text: string) {
    // Type chip text into the input at ~22ms/char, then pause 300ms and submit.
    if (streaming) return;
    setInput("");
    const step = 22;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setInput(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        window.setTimeout(() => sendMessage(text), 300);
      }
    }, step);
  }

  // Auto-focus the input on mount so keyboarders can just start typing.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Hero B-roll rotation — cross-dissolve every ~7 seconds.
  const [frameIndex, setFrameIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setFrameIndex((i) => (i + 1) % HERO_FRAMES.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 30%, #F7F1E6 0%, #F2E6D1 38%, #E8C9A6 72%, #C89675 100%)",
      }}
    >
      {/* B-ROLL LAYER — layered stills, Ken-Burns zoom, slow cross-dissolve.
          Replace with <video muted autoplay loop playsinline> when Futures B-roll is cut. */}
      <div aria-hidden className="absolute inset-0">
        {HERO_FRAMES.map((f, i) => (
          <div
            key={f.url}
            className={`kb-frame absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              i === frameIndex ? "is-active" : ""
            }`}
            style={{
              opacity: i === frameIndex ? 1 : 0,
              backgroundImage: `url(${f.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.85) brightness(0.95)",
            }}
          />
        ))}
        {/* Warm wash — unifies colour story + ensures WCAG AA on every frame */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(247,241,230,0.82) 0%, rgba(242,230,209,0.62) 40%, rgba(232,201,166,0.45) 70%, rgba(200,150,117,0.35) 100%)",
          }}
        />
      </div>

      {/* Ambient drifting warm blobs — add motion underneath the stills */}
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl"
        style={{ top: "-15%", left: "-10%", width: "70vw", height: "70vw", background: "#EAD0B1", opacity: 0.7 }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl"
        style={{ bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", background: "#D9B089", opacity: 0.55 }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: -8 }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl"
        style={{ top: "40%", left: "55%", width: "35vw", height: "35vw", background: "#F6D9B8", opacity: 0.45 }}
        animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: -14 }}
      />

      {/* Subtle grain overlay for analog warmth */}
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-40" aria-hidden />

      {/* Eyebrow — top left */}
      <div className="absolute top-28 left-6 sm:left-10 z-10">
        <p
          className="text-[11px] font-sans"
          style={{ letterSpacing: "0.28em", color: "#534D44", textTransform: "uppercase" }}
        >
          Futures · Campuses
        </p>
      </div>

      {/* Corner tour link — bottom right, quiet */}
      <Link
        href="#tour"
        className="absolute bottom-10 right-6 sm:right-10 z-10 group flex items-center gap-2 text-[15px] italic font-display"
        style={{ color: "#534D44" }}
      >
        <span className="lowercase">or take the tour</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>

      {/* Main content — glass card / country view on left, globe right on desktop; stacked on mobile */}
      <div className="relative z-10 grid min-h-screen items-center gap-10 px-6 py-28 sm:px-10 lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)] lg:gap-14 lg:px-16">
        <div className="w-full lg:max-w-[620px]">
          <AnimatePresence mode="wait">
          {activeRegion ? (
            <CountryView key={`country-${activeRegion}`} region={activeRegion} />
          ) : (
          <motion.div
            key="glass"
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              rotateX: tiltX,
              rotateY: tiltY,
              transformPerspective: 1200,
              transformStyle: "preserve-3d",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow:
                "0 30px 80px -20px rgba(20,20,20,0.25), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 0 0 1px rgba(20,20,20,0.03)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderRadius: 28,
            }}
            className="breathing-glass p-7 sm:p-10"
          >
            {/* Headline */}
            <h1
              className="font-display leading-[1.02] tracking-tight"
              style={{
                color: "#1C1A17",
                fontSize: "clamp(2.5rem, 5.2vw, 3.75rem)",
                fontWeight: 300,
              }}
            >
              Find your <em className="italic">home</em>. Ask anything.
            </h1>
            <p
              className="mt-5 font-sans max-w-[44ch]"
              style={{ color: "#534D44", fontSize: "17px", lineHeight: 1.55 }}
            >
              Twenty-one local churches across four countries — with four more launching in Venezuela. One Futures family. Ask our guide
              where you&rsquo;ll feel at home — a real pastor is never far away.
            </p>

            {/* AI input */}
            <form onSubmit={handleSubmit} className="mt-8">
              <div
                className={`ai-pill group relative flex items-center gap-2 rounded-[999px] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                  streaming ? "is-streaming" : ""
                } ${input.trim() ? "has-input" : ""}`}
                style={{
                  height: 72,
                  background: "rgba(255,255,255,0.85)",
                  border: `1.5px solid ${input.trim() || streaming ? "#C8906B" : "#E8DFD3"}`,
                  paddingLeft: 28,
                  paddingRight: 10,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={streaming}
                  placeholder={hasMessages ? "ask a follow-up…" : "ask anything — or type a city"}
                  aria-label="Ask anything about Futures"
                  className="warm-input flex-1 bg-transparent font-display italic outline-none disabled:opacity-60"
                  style={{
                    color: "#1C1A17",
                    fontSize: 18,
                  }}
                />
                <span
                  aria-hidden
                  className="hidden sm:inline-block mr-3 text-[11px] font-sans"
                  style={{ color: "#8A8178", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  ⏎ to ask
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  aria-label="Send"
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: input.trim() ? "#C8906B" : "#F2E6D1",
                    color: input.trim() ? "#FDFBF6" : "#8A8178",
                    transform: input.trim() && !streaming ? "translateX(2px)" : "translateX(0)",
                  }}
                >
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} />
                </button>
              </div>
            </form>

            {/* Response card — appears inside the same glass world */}
            <AnimatePresence>
              {hasMessages && (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18, mass: 1 }}
                  className="overflow-hidden"
                >
                  <div
                    className="relative"
                    style={{
                      background:
                        "radial-gradient(circle at 1px 1px, rgba(28,26,23,0.04) 1px, transparent 0) 0 0 / 16px 16px, #FFFDF8",
                      borderRadius: 20,
                      padding: "22px 24px",
                      boxShadow:
                        "0 14px 34px -14px rgba(20,20,20,0.18), inset 0 0 0 1px rgba(20,20,20,0.04)",
                    }}
                    role="status"
                    aria-live="polite"
                    aria-atomic="false"
                  >
                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        aria-hidden
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-display text-[14px]"
                        style={{ background: "#C8906B", color: "#FDFBF6" }}
                      >
                        f
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="font-sans"
                          style={{
                            color: "#8A8178",
                            fontSize: 11,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                          }}
                        >
                          a note from the Futures team
                        </p>
                        <div className="mt-2 space-y-3">
                          {messages.map((m) => (
                            <div key={m.id}>
                              {m.role === "user" ? (
                                <p
                                  className="font-display italic"
                                  style={{ color: "#534D44", fontSize: 16 }}
                                >
                                  &ldquo;{m.content}&rdquo;
                                </p>
                              ) : (
                                <p
                                  className="font-sans whitespace-pre-wrap"
                                  style={{ color: "#1C1A17", fontSize: 16.5, lineHeight: 1.62 }}
                                >
                                  {m.content}
                                  {streaming && m.content === "" && (
                                    <span
                                      className="inline-block h-[1em] w-[2px] -mb-[2px] ml-[1px] align-middle animate-pulse"
                                      style={{ background: "#C8906B" }}
                                    />
                                  )}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Save this answer"
                        className="flex-shrink-0 p-1 transition-opacity hover:opacity-100"
                        style={{ color: "#8A8178", opacity: 0.5 }}
                      >
                        <Bookmark className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {showFollowUps && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-4 flex flex-wrap items-center gap-2"
                    >
                      <span
                        className="font-display italic pr-1"
                        style={{ color: "#534D44", fontSize: 14 }}
                      >
                        want to keep going?
                      </span>
                      {["can someone pray for me this week?", "when are Sunday services?"].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleChip(q)}
                          className="rounded-full px-3 py-1.5 font-sans transition-all hover:-translate-y-[1px]"
                          style={{
                            background: "rgba(255,255,255,0.7)",
                            border: "1px solid rgba(20,20,20,0.08)",
                            color: "#1C1A17",
                            fontSize: 13,
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preset chips — only visible before first message */}
            {!hasMessages && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-7 flex flex-wrap gap-2.5"
              >
                {CHIPS_BY_LEVEL[level].map((chip, i) => (
                  <ChipButton key={chip} text={chip} delay={0.08 * i} onClick={() => handleChip(chip)} />
                ))}
              </motion.div>
            )}

            {/* People row */}
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {PEOPLE_ROW.map((p) => (
                  <div
                    key={p.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full font-display text-[13px] ring-2"
                    style={{ background: p.hue, color: "#FDFBF6", boxShadow: "0 2px 6px rgba(20,20,20,0.12)" }}
                    title={`${p.name} · ${p.caption}`}
                  >
                    {p.name[0]}
                  </div>
                ))}
              </div>
              <p className="font-sans" style={{ color: "#534D44", fontSize: 13 }}>
                <span className="font-display italic">{PEOPLE_ROW.map((p) => p.name).join(", ")}</span>{" "}
                &middot; some of our campus pastors
              </p>
            </div>
          </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Right column — the Globe (desktop) / stacks below (mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full"
        >
          <Globe
            focus={globeFocus}
            scale={globeScale}
            onCampusClick={handleDotClick}
          />
        </motion.div>
      </div>

      {/* Keyframes + reduced-motion handling, scoped to this section */}
      <style jsx>{`
        .kb-frame.is-active {
          animation: kenburns 14s ease-out forwards;
        }
        @keyframes kenburns {
          0%   { transform: scale(1.02) translate(0, 0); }
          100% { transform: scale(1.12) translate(-1.5%, -1%); }
        }
        .breathing-glass {
          animation: breathe 8s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { background-color: rgba(255, 252, 247, 0.68); }
          50% { background-color: rgba(255, 252, 247, 0.76); }
        }
        .ai-pill:not(.is-streaming) {
          animation: inputGlow 4s ease-in-out infinite;
        }
        .ai-pill.has-input,
        .ai-pill:focus-within {
          animation: none !important;
          box-shadow: 0 0 0 4px rgba(200, 144, 107, 0.12);
        }
        @keyframes inputGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 144, 107, 0); }
          50% { box-shadow: 0 0 24px 2px rgba(200, 144, 107, 0.18); }
        }
        .warm-input::placeholder {
          color: rgba(83, 77, 68, 0.6);
          font-style: italic;
        }
        @media (prefers-reduced-motion: reduce) {
          .breathing-glass,
          .ai-pill,
          .ai-pill:not(.is-streaming),
          .kb-frame.is-active {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function ChipButton({
  text,
  delay,
  onClick,
}: {
  text: string;
  delay: number;
  onClick: () => void;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useSpring(mx, { stiffness: 150, damping: 14 });
  const ty = useSpring(my, { stiffness: 150, damping: 14 });

  function handleMove(e: ReactMouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 3);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 3);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2, boxShadow: "0 8px 20px -8px rgba(20,20,20,0.18)" }}
      style={{
        x: tx,
        y: ty,
        background: "rgba(255,255,255,0.6)",
        border: "1px solid rgba(20,20,20,0.08)",
        borderRadius: 999,
        padding: "10px 16px",
        fontSize: 14,
        color: "#1C1A17",
      }}
      className="font-display italic transition-[border-color] duration-300 hover:border-[#C8906B]"
    >
      {text}
    </motion.button>
  );
}
