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
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Bookmark } from "lucide-react";
import { heroPortraits } from "@/lib/content/faces";

// Pastoral leadership — rotating portraits of the family who carry Futures.
// Jane + Ashley Evans (Global Senior), Tony + Aste Corbridge (Paradise campus),
// with more to come (Josh + Sjhana Greenwood Australia Lead, Doran + Mel South,
// and other campus pastor couples). 4.2s beat.
const HERO_FRAMES = [
  { url: "/photos/pastors/jane.jpg",      alt: "Jane Evans — Global Senior Pastor" },
  { url: "/photos/pastors/tony-aste.jpg", alt: "Tony & Aste Corbridge — Paradise campus pastors" },
  { url: "/photos/pastors/ashley.jpg",    alt: "Ashley Evans — Global Senior Pastor" },
  { url: "/photos/pastors/aste.jpg",      alt: "Aste Corbridge — Paradise campus" },
];

const HOME_CHIPS = [
  "what do you believe?",
  "find my closest campus",
  "plan my first Sunday",
  "who are Ashley & Jane?",
  "watch this Sunday",
  "how do I give?",
];

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

export function HomeHero() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const sessionId = useRef(uuid());
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const [frameIndex, setFrameIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setFrameIndex((i) => (i + 1) % HERO_FRAMES.length);
    }, 4200);
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
      <div aria-hidden className="absolute inset-0">
        {HERO_FRAMES.map((f, i) => (
          <div
            key={f.url}
            className={`kb-frame absolute inset-0 transition-opacity duration-[1100ms] ease-in-out ${
              i === frameIndex ? "is-active" : ""
            }`}
            style={{ opacity: i === frameIndex ? 1 : 0 }}
          >
            <Image
              src={f.url}
              alt={f.alt}
              fill
              sizes="100vw"
              className="object-cover object-center"
              style={{ filter: "saturate(0.85) brightness(0.95)" }}
              priority={i === 0}
            />
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(247,241,230,0.82) 0%, rgba(242,230,209,0.62) 40%, rgba(232,201,166,0.45) 70%, rgba(200,150,117,0.35) 100%)",
          }}
        />
      </div>

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

      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-40" aria-hidden />

      <Link
        href="/campuses"
        className="absolute bottom-10 right-6 sm:right-10 z-10 group flex items-center gap-2 text-[15px] italic font-display"
        style={{ color: "#1C1A17", textShadow: "0 1px 2px rgba(253,251,246,0.6)" }}
      >
        <span className="lowercase">or see our campuses</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1440px] items-center gap-10 px-6 py-28 sm:px-10 lg:grid-cols-[minmax(0,50fr)_minmax(0,50fr)] lg:gap-12 lg:px-16">
        <div className="w-full lg:max-w-[640px]">
          <motion.div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
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
            <h1
              className="font-display leading-[1.02] tracking-tight"
              style={{
                color: "#1C1A17",
                fontSize: "clamp(2.75rem, 5.8vw, 4.25rem)",
                fontWeight: 300,
              }}
            >
              <span className="block">Come <em className="italic">home</em>.</span>
              <span className="block">Ask Milo.</span>
            </h1>
            <p
              className="mt-5 font-sans max-w-[46ch]"
              style={{ color: "#534D44", fontSize: "17px", lineHeight: 1.55 }}
            >
              One Futures family across four countries — twenty-one local churches and four more
              launching in Venezuela. A home for everyone. Every race. Every age. Every stage.
              Ask Milo anything — our always-on guide. A real pastor is never far away.
            </p>

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
                  placeholder={hasMessages ? "ask Milo a follow-up…" : "ask Milo anything about Futures"}
                  aria-label="Ask Milo anything about Futures"
                  className="warm-input flex-1 bg-transparent font-display italic outline-none disabled:opacity-60"
                  style={{ color: "#1C1A17", fontSize: 18 }}
                />
                <span
                  aria-hidden
                  className="hidden sm:inline-block mr-3 text-[11px] font-sans"
                  style={{ color: "#8A8178", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  ⏎ to ask Milo
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

            {!hasMessages && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-7 flex flex-wrap gap-2.5"
              >
                {HOME_CHIPS.map((chip, i) => (
                  <ChipButton key={chip} text={chip} delay={0.08 * i} onClick={() => handleChip(chip)} />
                ))}
              </motion.div>
            )}

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
                <span className="font-display italic">Ashley &amp; Jane Evans</span>{" "}
                &middot; Global Senior Pastors
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right column — portrait collage (desktop) / scroll strip (mobile). */}
        <HeroPortraitCollage />
      </div>

      <style jsx>{`
        .kb-frame.is-active {
          animation: kenburns 8s ease-out forwards;
        }
        @keyframes kenburns {
          0% { transform: scale(1.02) translate(0, 0); }
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

/**
 * Hero portrait collage — right pane on desktop (lg+), horizontal scroll
 * strip below the text on mobile. Reads from content/faces.json via
 * lib/content/faces.ts, so swapping placeholders for real photography is
 * a single JSON edit.
 *
 * Four portraits in fixed roles:
 *   - large  — anchor (woman laughing, mid-50s)
 *   - medium — top-right (young man, mid-conversation)
 *   - small  — overlapping the large one (child being lifted)
 *   - small  — bottom-right (older man in prayer)
 *
 * Each frame: 85% saturation default → 100% on hover (200ms).
 * Gentle Ken Burns scale (1.00 → 1.04 over 20s, alternating).
 * Respects prefers-reduced-motion.
 */
function HeroPortraitCollage() {
  const large  = heroPortraits.find((p) => p.role === "large");
  const medium = heroPortraits.find((p) => p.role === "medium");
  const smalls = heroPortraits.filter((p) => p.role === "small");

  if (!large || !medium || smalls.length < 2) return null;

  return (
    <div
      role="img"
      aria-label="four members of the Futures family — a woman laughing, a young man in conversation, a child being lifted, and an older man in prayer"
      className="relative w-full"
    >
      {/* Desktop collage */}
      <div className="relative hidden aspect-[5/6] w-full lg:block">
        <PortraitFrame
          src={large.url}
          alt={large.alt}
          caption={large.name ? `${large.name} · ${large.campus}` : undefined}
          className="absolute bottom-0 left-0"
          style={{ width: "70%", height: "70%" }}
          delay={0.25}
          kenBurns
        />
        <PortraitFrame
          src={medium.url}
          alt={medium.alt}
          caption={medium.name ? `${medium.name} · ${medium.campus}` : undefined}
          className="absolute right-[2%] top-0"
          style={{ width: "52%", height: "48%" }}
          delay={0.4}
          kenBurns
        />
        <PortraitFrame
          src={smalls[0].url}
          alt={smalls[0].alt}
          className="absolute"
          style={{ top: "20%", left: "44%", width: "32%", height: "30%" }}
          delay={0.55}
        />
        <PortraitFrame
          src={smalls[1].url}
          alt={smalls[1].alt}
          caption={smalls[1].name ? `${smalls[1].name} · ${smalls[1].campus}` : undefined}
          className="absolute bottom-[4%] right-0"
          style={{ width: "38%", height: "35%" }}
          delay={0.7}
        />
      </div>

      {/* Mobile horizontal strip */}
      <div className="mt-8 flex gap-3 overflow-x-auto pb-2 lg:hidden [-webkit-overflow-scrolling:touch]">
        {heroPortraits.map((p, i) => (
          <div key={p.id} className="relative flex-shrink-0" style={{ width: 180, height: 220 }}>
            <PortraitFrame
              src={p.url}
              alt={p.alt}
              caption={p.name ? `${p.name} · ${p.campus}` : undefined}
              className="absolute inset-0"
              delay={0.2 + i * 0.08}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PortraitFrame({
  src,
  alt,
  caption,
  className,
  style,
  delay = 0,
  kenBurns = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  kenBurns?: boolean;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group relative overflow-hidden rounded-[6px] ${className ?? ""}`}
      style={{
        border: "2px solid #D9BFA0",
        boxShadow: "0 20px 50px -20px rgba(139, 115, 85, 0.35)",
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 31vw, 180px"
        className={`object-cover transition-[filter] duration-500 ease-out group-hover:saturate-100 ${kenBurns ? "hero-kb" : ""}`}
        style={{ filter: "saturate(0.85)" }}
      />
      {caption && (
        <figcaption
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[rgba(28,26,23,0.72)] to-transparent p-3 text-[11px] font-sans uppercase tracking-[0.18em] text-cream transition-transform duration-300 ease-out group-hover:translate-y-0"
        >
          {caption}
        </figcaption>
      )}
      <style jsx>{`
        .hero-kb {
          animation: heroKb 20s ease-in-out infinite alternate;
        }
        @keyframes heroKb {
          0%   { transform: scale(1.0)  translate(0, 0); }
          100% { transform: scale(1.04) translate(-1%, -1%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-kb { animation: none !important; }
        }
      `}</style>
    </motion.figure>
  );
}
