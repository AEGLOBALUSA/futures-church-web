"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Play, Pause, Share2, X } from "lucide-react";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow, Hero, Sub } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type Sermon = {
  id: string;
  title: string;
  series: string;
  preacher: string;
  date: string;
  duration: string;
  scripture: string;
  theme?: string;
  thumb: string;
  videoUrl?: string | null;
  chapters?: { t: string; label: string }[];
};

type Series = {
  slug: string;
  title: string;
  preacher: string;
  episodes: number;
  cover: string;
  blurb: string;
};

type SermonsData = {
  isLive: boolean;
  liveStreamUrl: string | null;
  featuredSeries: Series[];
  latest: Sermon;
  archive: Sermon[];
};

const WATCH_CHIPS = [
  "what's the latest sermon?",
  "find a message about anxiety",
  "what did Ashley preach last Sunday?",
  "show me Jane's teaching on identity",
  "I need something about forgiveness",
  "what should I watch first if I'm new?",
];

export function WatchPageClient({ data }: { data: SermonsData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("watch"), [setPageContext]);

  const [playing, setPlaying] = useState<Sermon | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const p =
        window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (p > 0.55) setFormVisible(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openLatest() {
    setPlaying(data.latest);
    setFormVisible(true);
  }

  return (
    <main className="bg-cream text-ink-900">
      {data.isLive && <WatchNowLiveStrip />}
      <WatchHero latest={data.latest} onPlay={openLatest} />
      <FeaturedSeries items={data.featuredSeries} />
      <SermonArchive archive={data.archive} onPlay={(s) => { setPlaying(s); setFormVisible(true); }} />
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-[640px]">
          {formVisible ? (
            <ValueExchangeForm
              source="watch-followup"
              offer="Get next week's sermon when it drops, with three questions to make it stick."
              proofPoints={[
                "Hand-written by our pastors",
                "One email, Tuesday morning",
                "Unsubscribe any time",
              ]}
              fields={["email"]}
              cta="Send me next week's sermon"
              outcome="Tuesday morning, you'll get the first one."
            />
          ) : (
            <p className="text-center font-ui text-sm text-ink-600">
              Keep scrolling &mdash; we&rsquo;ll meet you with next week&rsquo;s sermon below.
            </p>
          )}
        </div>
      </section>

      {playing && <SermonPlayer sermon={playing} onClose={() => setPlaying(null)} />}
    </main>
  );
}

/* ------------------------------------------------------------ */

function WatchNowLiveStrip() {
  return (
    <div className="sticky top-0 z-40 bg-warm-700 text-cream">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex">
            <span className="h-2 w-2 animate-ping rounded-full bg-cream" />
            <span className="absolute inset-0 h-2 w-2 rounded-full bg-cream" />
          </span>
          <p className="font-ui text-[13px] uppercase tracking-[0.2em]">Live now</p>
        </div>
        <a href="#player" className="font-ui text-[13px] underline-offset-4 hover:underline">
          Join the stream &rarr;
        </a>
      </div>
    </div>
  );
}

function WatchHero({ latest, onPlay }: { latest: Sermon; onPlay: () => void }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 0%, #F2E6D1 0%, #FDFBF6 40%, #FDFBF6 100%)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
        <Eyebrow>WATCH &middot; ON DEMAND</Eyebrow>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 max-w-[18ch]"
        >
          <Hero>
            Press play. We&rsquo;ll <em className="italic">meet you</em> here.
          </Hero>
        </motion.div>
        <Sub className="mt-6 max-w-[52ch]">
          Sunday services, weekday teaching, and sermons that found someone in a Tuesday 2am.
        </Sub>

        <div className="mt-12 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto]">
          <GlassCard breathe className="p-6 sm:p-8">
            <AIInput
              placeholder="Ask Ezra anything about the teaching&hellip;"
              chips={WATCH_CHIPS}
              compact
            />
            <div className="mt-5 flex items-center gap-3 border-t border-ink-900/10 pt-4">
              <Image
                src={latest.thumb}
                alt=""
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-display italic text-ink-900" style={{ fontSize: 18, fontWeight: 300 }}>
                  {latest.title}
                </p>
                <p className="mt-0.5 truncate font-ui text-[12px] text-ink-600">
                  {latest.series} &middot; {latest.preacher} &middot; {latest.date} &middot; {latest.duration}
                </p>
              </div>
            </div>
          </GlassCard>

          <button
            type="button"
            onClick={onPlay}
            aria-label="Play latest sermon"
            className="group relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 transition-transform hover:scale-105"
            style={{
              background: "#FDFBF6",
              borderColor: "#C8906B",
              boxShadow: "0 18px 40px -20px rgba(200,144,107,0.5)",
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 animate-input-breathe rounded-full"
            />
            <Play className="ml-1 h-8 w-8 fill-warm-700 text-warm-700" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

function FeaturedSeries({ items }: { items: Series[] }) {
  return (
    <section className="bg-cream px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1440px]">
        <Eyebrow>FEATURED SERIES</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Three seasons worth <em className="italic">starting</em>.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((s) => (
            <motion.button
              key={s.slug}
              type="button"
              whileHover={{ y: -4, rotate: -0.5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group overflow-hidden rounded-[22px] bg-white text-left shadow-[0_18px_40px_-22px_rgba(20,20,20,0.3)]"
              style={{ border: "1px solid rgba(20,20,20,0.06)" }}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={s.cover}
                  alt={s.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 50%, rgba(28,26,23,0.7) 100%)" }}
                />
                <div className="absolute inset-x-5 bottom-4 text-cream">
                  <p className="font-ui text-[11px] uppercase tracking-[0.22em] opacity-85">
                    {s.preacher} &middot; {s.episodes} episodes
                  </p>
                  <p className="mt-1 font-display italic" style={{ fontSize: 24, fontWeight: 300 }}>
                    {s.title}
                  </p>
                </div>
              </div>
              <div className="p-5">
                <p className="font-body text-[14px] leading-relaxed text-ink-600">
                  {s.blurb}
                </p>
                <p className="mt-4 font-ui text-[13px] text-warm-700">
                  Start the series &rarr;
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SermonArchive({ archive, onPlay }: { archive: Sermon[]; onPlay: (s: Sermon) => void }) {
  const [series, setSeries] = useState<string>("all");
  const [preacher, setPreacher] = useState<string>("all");
  const [theme, setTheme] = useState<string>("all");

  const seriesOptions = useMemo(
    () => ["all", ...Array.from(new Set(archive.map((s) => s.series)))],
    [archive],
  );
  const preacherOptions = useMemo(
    () => ["all", ...Array.from(new Set(archive.map((s) => s.preacher)))],
    [archive],
  );
  const themeOptions = useMemo(
    () => ["all", ...Array.from(new Set(archive.map((s) => s.theme ?? "").filter(Boolean)))],
    [archive],
  );

  const filtered = archive.filter(
    (s) =>
      (series === "all" || s.series === series) &&
      (preacher === "all" || s.preacher === preacher) &&
      (theme === "all" || s.theme === theme),
  );

  return (
    <section id="archive" className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>ARCHIVE</Eyebrow>
            <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}>
              Every message, <em className="italic">searchable</em>.
            </h2>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <FilterSelect label="Series" value={series} onChange={setSeries} options={seriesOptions} />
          <FilterSelect label="Preacher" value={preacher} onChange={setPreacher} options={preacherOptions} />
          <FilterSelect label="Theme" value={theme} onChange={setTheme} options={themeOptions} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <article
              key={s.id}
              className="overflow-hidden rounded-[20px] bg-white shadow-[0_14px_32px_-22px_rgba(20,20,20,0.25)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <button
                type="button"
                onClick={() => onPlay(s)}
                className="group relative block aspect-[16/10] w-full overflow-hidden"
                aria-label={`Play ${s.title}`}
              >
                <Image
                  src={s.thumb}
                  alt={s.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 55%, rgba(28,26,23,0.6) 100%)" }}
                />
                <span
                  className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden
                >
                  <Play className="ml-0.5 h-5 w-5 fill-warm-700 text-warm-700" strokeWidth={1.5} />
                </span>
                <p className="absolute bottom-3 right-3 rounded-full bg-ink-900/70 px-2.5 py-1 font-ui text-[11px] text-cream">
                  {s.duration}
                </p>
              </button>
              <div className="p-5">
                <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-600">
                  {s.series} &middot; {s.preacher}
                </p>
                <p className="mt-2 font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.15 }}>
                  {s.title}
                </p>
                <p className="mt-2 font-body text-[13px] text-ink-600">
                  {s.scripture} &middot; {s.date}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onPlay(s)}
                    className="inline-flex items-center gap-1.5 font-ui text-[13px] text-warm-700"
                  >
                    Play &rarr;
                  </button>
                  <ShareButton sermonId={s.id} title={s.title} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-white/80 px-4 py-2 font-ui text-[13px]">
      <span className="text-ink-600">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-ink-900 outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "all" ? "All" : o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ShareButton({ sermonId, title }: { sermonId: string; title: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/watch?sermon=${sermonId}`;
    try {
      if (navigator.share) {
        await navigator.share({ url, title });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 font-ui text-[12px] text-ink-600 hover:text-ink-900"
      aria-label="Share this sermon"
    >
      <Share2 className="h-3.5 w-3.5" />
      {copied ? "Copied" : "Share"}
    </button>
  );
}

function SermonPlayer({ sermon, onClose }: { sermon: Sermon; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const canStream = Boolean(sermon.videoUrl);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[1000px] overflow-hidden rounded-[22px] bg-ink-900 text-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close player"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative aspect-video w-full bg-black">
          {canStream && sermon.videoUrl ? (
            <video
              src={sermon.videoUrl}
              className="h-full w-full"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <>
              <Image src={sermon.thumb} alt={sermon.title} fill unoptimized className="object-cover opacity-60" />
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-warm-700 transition-transform hover:scale-105"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6 fill-warm-700" />}
              </button>
              <p className="absolute bottom-4 left-4 font-ui text-xs text-cream/70">
                (Streaming provider wires up post-launch &middot; showing preview poster)
              </p>
            </>
          )}
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_220px]">
          <div>
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-cream/60">
              {sermon.series} &middot; {sermon.preacher}
            </p>
            <p className="mt-2 font-display italic" style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.1 }}>
              {sermon.title}
            </p>
            <p className="mt-2 font-ui text-[13px] text-cream/70">
              {sermon.scripture} &middot; {sermon.date} &middot; {sermon.duration}
            </p>
          </div>
          {sermon.chapters && (
            <div>
              <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-cream/60">Chapters</p>
              <ul className="mt-3 flex flex-col gap-2">
                {sermon.chapters.map((c) => (
                  <li key={c.t} className="flex justify-between font-ui text-[13px]">
                    <span className="text-cream/80">{c.label}</span>
                    <span className="text-cream/50">{c.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
