import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Share2 } from "lucide-react";
import dailyWord from "@/content/daily-word.json";
import { EmailCapture } from "@/components/ui/EmailCapture";

type FullEntry = {
  date: string;
  scripture: { text: string; reference: string };
  reflection: string;
  question: string;
};

type ArchiveEntry = {
  date: string;
  reference: string;
  preview: string;
};

type DailyWordData = {
  today: FullEntry;
  archive: ArchiveEntry[];
  subscriberCount: number;
};

const data = dailyWord as DailyWordData;

// Combined sorted list of every dated entry, newest first.
function allDates(): string[] {
  const dates = new Set<string>([data.today.date, ...data.archive.map((a) => a.date)]);
  return Array.from(dates).sort().reverse();
}

function findEntry(date: string): { full?: FullEntry; archive?: ArchiveEntry } {
  if (data.today.date === date) return { full: data.today };
  const archive = data.archive.find((a) => a.date === date);
  return { archive };
}

function neighborDates(date: string): { prev: string | null; next: string | null } {
  const list = allDates();
  const idx = list.indexOf(date);
  if (idx === -1) return { prev: null, next: null };
  // newest first → prev = older (idx + 1), next = newer (idx - 1)
  return {
    prev: list[idx + 1] ?? null,
    next: list[idx - 1] ?? null,
  };
}

function formatLong(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateStaticParams() {
  return allDates().map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const { full, archive } = findEntry(date);
  const ref = full?.scripture.reference ?? archive?.reference ?? "";
  const desc = full?.reflection.slice(0, 160) ?? archive?.preview ?? "Daily Word from Futures Church.";
  return {
    title: `Daily Word · ${formatLong(date)}`,
    description: ref ? `${ref} — ${desc}` : desc,
    openGraph: {
      title: `Daily Word · ${ref}`,
      description: desc,
    },
  };
}

export default async function DailyWordEntryPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const { full, archive } = findEntry(date);
  if (!full && !archive) notFound();
  const { prev, next } = neighborDates(date);
  const isToday = !!full;

  return (
    <main className="bg-cream-200 text-ink-900">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #F7F1E6 0%, #F2E6D1 45%, #E8C9A6 80%, #D9B089 100%)",
          }}
        />
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-10 sm:px-10 lg:px-16">
          <Link
            href="/daily-word"
            className="group inline-flex items-center gap-2 font-sans text-ink-600 hover:text-ink-900"
            style={{ fontSize: 13 }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2} />
            <span>Daily Word</span>
          </Link>

          <p className="mt-10 font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
            {formatLong(date)}
          </p>

          {/* Scripture — the anchor */}
          <h1 className="mt-6 font-display text-display-lg italic leading-[1.05] text-ink-900">
            {full ? full.scripture.text : <ScriptureFromReference reference={archive!.reference} />}
          </h1>
          <p className="mt-5 font-sans text-ink-600" style={{ fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            <BookOpen className="inline h-3.5 w-3.5 mr-2 -translate-y-0.5" strokeWidth={1.6} />
            {full ? full.scripture.reference : archive!.reference}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 sm:px-10 lg:px-16">
        {full ? (
          <>
            <p className="mt-10 font-sans leading-[1.8] text-ink-900" style={{ fontSize: 18 }}>
              {full.reflection}
            </p>
            {full.question && (
              <div className="mt-12 rounded-3xl border border-ink-900/10 bg-cream/80 px-7 py-7 sm:px-9">
                <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-accent">
                  One question
                </p>
                <p
                  className="mt-3 font-display italic text-ink-900"
                  style={{ fontSize: "clamp(1.25rem, 1.9vw, 1.65rem)", lineHeight: 1.45, fontWeight: 300 }}
                >
                  {full.question}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mt-10 font-display italic text-ink-700" style={{ fontSize: 19, lineHeight: 1.55, fontWeight: 300 }}>
              &ldquo;{archive!.preview}&rdquo;
            </p>
            <div className="mt-10 rounded-3xl border border-dashed border-accent/40 bg-cream/70 px-7 py-7 sm:px-9">
              <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-accent">
                The full reflection
              </p>
              <p className="mt-3 font-display italic text-ink-700" style={{ fontSize: 18, lineHeight: 1.5, fontWeight: 300 }}>
                Full reflections go to subscribers each morning at 5am their time. Archive
                browsing is at{" "}
                <a
                  href="https://futuresdailyword.com/archive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-4"
                >
                  futuresdailyword.com/archive
                </a>
                .
              </p>
            </div>
          </>
        )}

        {/* Subscribe — every page should make this easy */}
        <div className="mt-16 rounded-3xl bg-ink-900 px-7 py-9 sm:px-10 sm:py-11 text-cream">
          <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-cream/60">
            {isToday ? "Tomorrow morning" : "Each morning"}
          </p>
          <h2
            className="mt-3 font-display italic"
            style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.15, fontWeight: 300 }}
          >
            One scripture. One reflection. One question to carry.
          </h2>
          <p className="mt-3 font-sans text-cream/80" style={{ fontSize: 14 }}>
            Sent at 5am your time. Free. Skippable. Never spammy.
            <br />
            Joining {data.subscriberCount.toLocaleString()} others.
          </p>
          <div className="mt-5 max-w-md">
            <EmailCapture
              source="daily-word-entry"
              placeholder="you@yours"
              ctaText="Send me tomorrow"
              successMessage="You're on. First word lands at 5am."
              variant="night"
            />
          </div>
        </div>

        {/* Prev / Next + Share */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink-900/10 pt-6">
          <div className="flex gap-3">
            {prev ? (
              <Link
                href={`/daily-word/${prev}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream/70 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-700 hover:bg-cream-300"
              >
                <ArrowLeft className="size-3.5" /> Earlier
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-cream/40 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-400">
                Earliest
              </span>
            )}
            {next ? (
              <Link
                href={`/daily-word/${next}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream/70 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-700 hover:bg-cream-300"
              >
                Later <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-cream/40 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-400">
                Most recent
              </span>
            )}
          </div>
          <ShareLinks date={date} reference={full?.scripture.reference ?? archive?.reference ?? ""} />
        </div>
      </section>
    </main>
  );
}

function ScriptureFromReference({ reference }: { reference: string }) {
  // For archive entries we don't have the scripture text — only the reference.
  // Render the reference as the "headline" since it's the most concrete thing.
  return <span>{reference}</span>;
}

function ShareLinks({ date, reference }: { date: string; reference: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";
  const url = `${baseUrl}/daily-word/${date}`;
  const text = reference ? `Daily Word · ${reference}` : "Daily Word";

  return (
    <div className="flex items-center gap-2">
      <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Share</span>
      <a
        href={`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`}
        className="rounded-full border border-ink-900/15 bg-cream/70 p-2 text-ink-700 hover:bg-cream-300"
        aria-label="Share by email"
      >
        <Share2 className="size-3.5" />
      </a>
    </div>
  );
}
