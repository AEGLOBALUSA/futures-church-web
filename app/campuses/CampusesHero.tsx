"use client";

import {
  useState,
  useRef,
  useEffect,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { campuses, type CampusRegion } from "@/lib/content/campuses";
import { CountryView } from "./CountryView";
import { AIInput } from "@/components/ai/AIInput";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

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
// Real Futures B-roll — a diverse spread across age, stage, and campus.
// Curated from the full photo library. Different order than the home page so
// the Campuses hero feels distinct.
const HERO_FRAMES = [
  { url: "/photos/hero/hero_5.jpg",    alt: "Futures Church — family" },
  { url: "/photos/hero/hero_12.jpg",   alt: "Futures Church — hands raised" },
  { url: "/photos/hero/hero_30.jpg",   alt: "Futures Church — community" },
  { url: "/photos/hero/hero_31.jpg",   alt: "Futures Church — Sunday together" },
  { url: "/photos/hero/hero_16.jpg",   alt: "Futures Church — worship moment" },
  { url: "/photos/hero/hero_8.jpg",    alt: "Futures Church — every age & stage" },
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
  "south-america": [
    "when does Caracas launch?",
    "how can I get involved?",
    "which city launches first?",
    "can I give toward South America?",
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
  "south-america": { lat: 9, lng: -68 },
  brazil: { lat: -14, lng: -52 },
  global: null,
};

const VALID_REGIONS: CampusRegion[] = [
  "australia",
  "usa",
  "indonesia",
  "south-america",
  "brazil",
  "global",
];

// People row — real campus pastors. Rotate weekly across the pastor pool.
const PEOPLE_ROW = [
  { name: "Ashley", caption: "Global Senior", hue: "#C45236" },
  { name: "Jane", caption: "Global Senior", hue: "#8A5A3C" },
  { name: "Josh", caption: "Australia Lead", hue: "#C8906B" },
  { name: "Sjhana", caption: "Australia Lead", hue: "#AC9B25" },
];

export function CampusesHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");
  const activeRegion: CampusRegion | null =
    countryParam && (VALID_REGIONS as string[]).includes(countryParam)
      ? (countryParam as CampusRegion)
      : null;
  const level: keyof typeof CHIPS_BY_LEVEL = activeRegion ?? "globe";

  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("campuses"), [setPageContext, activeRegion]);

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

  // Hero B-roll rotation — cross-dissolve every ~4.2 seconds for a livelier cadence.
  const [frameIndex, setFrameIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setFrameIndex((i) => (i + 1) % HERO_FRAMES.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

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
            className={`kb-frame absolute inset-0 transition-opacity duration-[1100ms] ease-in-out ${
              i === frameIndex ? "is-active" : ""
            }`}
            style={{
              opacity: i === frameIndex ? 1 : 0,
              backgroundImage: `url(${f.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        {/* Soft warm wash — light enough that photos stay visible, strong enough
            that the glass card on top still reads (backdrop-blur handles contrast). */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(247,241,230,0.32) 0%, rgba(242,230,209,0.22) 45%, rgba(200,150,117,0.18) 100%)",
          }}
        />
      </div>

      {/* Ambient drifting warm blobs — dialed down so B-roll photos stay visible */}
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl mix-blend-soft-light"
        style={{ top: "-15%", left: "-10%", width: "70vw", height: "70vw", background: "#EAD0B1", opacity: 0.2 }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl mix-blend-soft-light"
        style={{ bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", background: "#D9B089", opacity: 0.18 }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: -8 }}
      />

      {/* Subtle grain overlay for analog warmth */}
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-40" aria-hidden />

      {/* Eyebrow — top left */}
      <div className="absolute top-28 left-6 sm:left-10 z-10">
        <p
          className="text-[11px] font-sans"
          style={{
            letterSpacing: "0.28em",
            color: "#1C1A17",
            textTransform: "uppercase",
            fontWeight: 600,
            textShadow: "0 1px 2px rgba(253,251,246,0.6)",
          }}
        >
          Futures · Campuses
        </p>
      </div>

      {/* Corner tour link — bottom right, quiet */}
      <Link
        href="#tour"
        className="absolute bottom-10 right-6 sm:right-10 z-10 group flex items-center gap-2 text-[15px] italic font-display"
        style={{ color: "#1C1A17", textShadow: "0 1px 2px rgba(253,251,246,0.6)" }}
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
              Find your <em className="italic">home</em>. Ask Ezra.
            </h1>
            <p
              className="mt-5 font-sans max-w-[44ch]"
              style={{ color: "#534D44", fontSize: "17px", lineHeight: 1.55 }}
            >
              Twenty-one local churches across four countries — with four more launching in Venezuela. One Futures family. Ask Ezra
              where you&rsquo;ll feel at home — a real pastor is never far away.
            </p>

            {/* AI input — shared primitive via AIGuideContext */}
            <div className="mt-8">
              <AIInput
                placeholder="ask Ezra — or type a city"
                chips={CHIPS_BY_LEVEL[level]}
                compact
              />
            </div>

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
          animation: kenburns 8s ease-out forwards;
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

