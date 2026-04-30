"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, X } from "lucide-react";

// Moments — 12 scenes across the Futures family. Image-driven Ken-Burns today;
// swap for <video> with real clips when the Hannah/comms team cuts them.
type Moment = {
  id: string;
  title: string;
  caption: string;
  campus: string;
  image: string;
  accent: string;
};

// Moment tiles — each chosen so the reel reads as globally diverse:
// Australian (white + Aboriginal), African-American, Venezuelan/Latino,
// Indonesian (Javanese, Balinese, Minahasan, East Kalimantan), Brazilian,
// South Asian. Keep the ethnic spread when swapping to real photography.
const MOMENTS: Moment[] = [
  {
    id: "paradise-sunday",
    title: "Sunday morning, Paradise",
    caption: "The doors open. The coffee starts. The family begins to arrive.",
    campus: "Paradise · Adelaide",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=75&auto=format&fit=crop",
    accent: "#C8906B",
  },
  {
    id: "la-worship",
    title: "Hands up, Los Angeles",
    caption: "Mid-worship in the main auditorium, a few hundred voices holding one note.",
    campus: "Los Angeles · California",
    image: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=1600&q=75&auto=format&fit=crop",
    accent: "#AC9B25",
  },
  {
    id: "futuros-caracas",
    title: "La familia",
    caption: "Caracas — Spanish, laughter, three generations at one table.",
    campus: "Caracas · Venezuela (launching)",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=75&auto=format&fit=crop",
    accent: "#C45236",
  },
  {
    id: "bali-sunrise",
    title: "Sunrise prayer, Bali",
    caption: "Denpasar, 5:40am. A handful of young leaders before anyone else is awake.",
    campus: "Bali · Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=75&auto=format&fit=crop",
    accent: "#8A5A3C",
  },
  {
    id: "kids-mount-barker",
    title: "Kids church, Mount Barker",
    caption: "Loud, bright, safe. Two hours no parent wants to miss.",
    campus: "Mount Barker · Adelaide Hills",
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=1600&q=75&auto=format&fit=crop",
    accent: "#D9B089",
  },
  {
    id: "ashley-preach",
    title: "A word from Ps. Ashley",
    caption: "Twenty-six years of Sundays and still no dead weeks.",
    campus: "All campuses",
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=75&auto=format&fit=crop",
    accent: "#765020",
  },
  {
    id: "solo-youth",
    title: "Youth night, Solo",
    caption: "Surakarta's teenagers packed out the hall — they always do on Friday.",
    campus: "Solo · Central Java",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1600&q=75&auto=format&fit=crop",
    accent: "#C8906B",
  },
  {
    id: "cemani-baptism",
    title: "Baptism Sunday, Cemani",
    caption: "Fourteen baptisms. Every one of them a story no spreadsheet will catch.",
    campus: "Cemani · Central Java",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&q=75&auto=format&fit=crop",
    accent: "#AC9B25",
  },
  {
    id: "langowan-harvest",
    title: "Harvest Sunday, Langowan",
    caption: "North Sulawesi fills the church with what it grows.",
    campus: "Langowan · North Sulawesi",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=75&auto=format&fit=crop",
    accent: "#C45236",
  },
  {
    id: "samarinda-worship",
    title: "Worship night, Samarinda",
    caption: "East Kalimantan's newest campus — and loudest room.",
    campus: "Samarinda · East Kalimantan",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=75&auto=format&fit=crop",
    accent: "#8A5A3C",
  },
  {
    id: "adelaide-coffee",
    title: "After-service, Adelaide City",
    caption: "The room empties at 11:30. The foyer is still full at 1pm.",
    campus: "Adelaide City · SA",
    image: "https://images.unsplash.com/photo-1524673450801-b5aa9b621b76?w=1600&q=75&auto=format&fit=crop",
    accent: "#D9B089",
  },
  {
    id: "online-global",
    title: "Online Church, everywhere",
    caption: "Three time zones, one service. Comments from São Paulo, Nairobi, Kansas.",
    campus: "Online · Worldwide",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=75&auto=format&fit=crop",
    accent: "#765020",
  },
];

export function MomentsReel() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<Moment | null>(null);

  // Close modal on ESC
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section
      className="relative overflow-hidden py-28 sm:py-32"
      style={{ background: "#FDFBF6" }}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-[50ch]"
        >
          <p
            className="font-sans"
            style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            A week across the family
          </p>
          <h2
            className="mt-4 font-display"
            style={{ color: "#1C1A17", fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.05, fontWeight: 300 }}
          >
            Twelve moments from twelve rooms.
          </h2>
          <p className="mt-4 font-sans" style={{ color: "#534D44", fontSize: 16, lineHeight: 1.6 }}>
            Click any card. Every moment is a real rhythm somewhere in the Futures family this week.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOMENTS.map((m, i) => (
            <MomentCard key={m.id} moment={m} index={i} onOpen={() => setActive(m)} />
          ))}
        </div>
      </div>

      {/* Expanded moment modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10"
            style={{ background: "rgba(20,20,20,0.85)", backdropFilter: "blur(12px)" }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 10 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-[28px]"
              style={{ background: "#FDFBF6", boxShadow: "0 40px 120px -20px rgba(0,0,0,0.55)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ aspectRatio: "16 / 9", background: active.accent }}>
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  sizes="90vw"
                  className="object-cover kb-active"
                  unoptimized
                />
                <div
                  aria-hidden
                  className="absolute inset-0 mix-blend-soft-light"
                  style={{ background: active.accent, opacity: 0.2 }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 50%, rgba(20,20,20,0.5) 100%)" }}
                />
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-105"
                  style={{ background: "rgba(253,251,246,0.92)", color: "#1C1A17" }}
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <p
                    className="font-sans"
                    style={{
                      color: "rgba(253,251,246,0.85)",
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                    }}
                  >
                    {active.campus}
                  </p>
                  <h3
                    className="mt-1 font-display"
                    style={{ color: "#FDFBF6", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300 }}
                  >
                    {active.title}
                  </h3>
                </div>
              </div>
              <div className="p-7 sm:p-9">
                <p
                  className="font-display italic"
                  style={{ color: "#1C1A17", fontSize: 20, lineHeight: 1.5, fontWeight: 300 }}
                >
                  {active.caption}
                </p>
                <p
                  className="mt-4 font-sans"
                  style={{ color: "#8A8178", fontSize: 13 }}
                >
                  This is placeholder footage. The Futures comms team will replace each moment with a real 6-second loop from that campus over the next month.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .kb-active { animation: reel-kb 16s ease-out forwards; }
        @keyframes reel-kb {
          0%   { transform: scale(1.02); }
          100% { transform: scale(1.14) translate(-1%, -1%); }
        }
      `}</style>
    </section>
  );
}

function MomentCard({
  moment,
  index,
  onOpen,
}: {
  moment: Moment;
  index: number;
  onOpen: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-[22px] text-left w-full"
      style={{
        aspectRatio: "4 / 5",
        background: moment.accent,
        boxShadow: hovered
          ? "0 30px 60px -22px rgba(20,20,20,0.4)"
          : "0 14px 36px -18px rgba(20,20,20,0.24)",
        transition: "box-shadow 400ms cubic-bezier(0.25,0.1,0.25,1), transform 400ms cubic-bezier(0.25,0.1,0.25,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      aria-label={`Open moment: ${moment.title}`}
    >
      <Image
        src={moment.image}
        alt={moment.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={`object-cover transition-transform duration-[900ms] ease-out ${
          hovered ? "kb-hover" : ""
        }`}
        style={{ transform: hovered ? "scale(1.1)" : "scale(1.02)" }}
        unoptimized
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-soft-light transition-opacity duration-500"
        style={{ background: moment.accent, opacity: hovered ? 0.12 : 0.28 }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 40%, rgba(20,20,20,0.7) 100%)" }}
      />

      {/* Play affordance — appears on hover */}
      <span
        aria-hidden
        className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500"
        style={{
          background: "rgba(253,251,246,0.95)",
          color: moment.accent,
          opacity: hovered ? 1 : 0.6,
          transform: hovered ? "scale(1)" : "scale(0.9)",
        }}
      >
        <Play className="h-4 w-4 ml-0.5" strokeWidth={2.5} fill={moment.accent} />
      </span>

      <div className="absolute bottom-5 left-5 right-5">
        <p
          className="font-sans"
          style={{
            color: "rgba(253,251,246,0.85)",
            fontSize: 10,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
          }}
        >
          {moment.campus}
        </p>
        <p className="mt-1.5 font-display" style={{ color: "#FDFBF6", fontSize: 22, fontWeight: 300, lineHeight: 1.1 }}>
          {moment.title}
        </p>
        <p
          className="mt-2 font-display italic transition-all duration-500"
          style={{
            color: "rgba(253,251,246,0.85)",
            fontSize: 13,
            lineHeight: 1.45,
            maxHeight: hovered ? 80 : 0,
            opacity: hovered ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {moment.caption}
        </p>
      </div>
    </motion.button>
  );
}
