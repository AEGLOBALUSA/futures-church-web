"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { books, type Book } from "@/lib/content/books";

const CHIPS = [
  "which book should I start with?",
  "is there a study guide?",
  "can I read a free chapter?",
  "when does Multiply or Die ship?",
  "do you have audiobooks?",
  "is there a bulk / church pack?",
];

const TESTIMONIALS = [
  { q: "No More Fear put words to the thing I&rsquo;d been living with for a decade.", name: "Caleb", book: "No More Fear" },
  { q: "I read Help I&rsquo;m A Mother in one night and slept better than I had in months.", name: "Olivia", book: "Help I&rsquo;m A Mother!" },
  { q: "Scarcity to Supply changed how we think about money as a family.", name: "Daniel & Em", book: "From Scarcity to Supernatural Supply" },
];

export function BooksPageClient() {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("books"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <BooksHero />
      <FeaturedBook />
      <BooksGrid />
      <AuthorQA />
      <StudyGuidesSection />
      <BooksNewsletter />
    </main>
  );
}

function BooksHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 20% 10%, rgba(204,143,74,0.14), transparent 70%)" }} />
      <div className="relative mx-auto max-w-[1200px]">
        <Eyebrow>BOOKS &middot; ASHLEY & JANE EVANS</Eyebrow>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 font-display text-ink-900"
          style={{ fontSize: "clamp(2.5rem,6.5vw,5.5rem)", fontWeight: 300, lineHeight: 0.98, letterSpacing: "-0.02em" }}
        >
          Words that <em className="italic">build</em>.
        </motion.h1>
        <p className="mt-6 max-w-[58ch] font-body text-[18px] leading-relaxed text-ink-600">
          Books from Ashley and Jane Evans &mdash; read a free chapter, grab a study guide, or lock in the next release.
        </p>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-5">
            <AIInput placeholder="Ask which book to read first&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function FeaturedBook() {
  const featured = books.find((b) => b.id === "scarcity-to-supply") ?? books[0];
  return (
    <section className="px-6 py-20 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px] grid gap-10 md:grid-cols-[1fr,1.3fr] items-center">
        <div className="flex items-center justify-center">
          <BookCover book={featured} large />
        </div>
        <div>
          <Eyebrow>FEATURED &middot; {featured.author.toUpperCase()}</Eyebrow>
          <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
            {featured.title}
          </h2>
          <p className="mt-5 max-w-[58ch] font-body text-[17px] leading-relaxed text-ink-600">{featured.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {featured.buyUrl && (
              <a href={featured.buyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[15px] text-cream transition-transform hover:-translate-y-0.5">
                Buy the book <span>&rarr;</span>
              </a>
            )}
            <a href={`#free-chapter-${featured.id}`} className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 bg-white/50 px-6 py-3 font-ui text-[15px] text-ink-900 transition-colors hover:border-warm-500">
              Free chapter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function BooksGrid() {
  const [category, setCategory] = useState<"all" | "leadership" | "personal" | "family">("all");
  const [selected, setSelected] = useState<Book | null>(null);
  const filtered = useMemo(
    () => (category === "all" ? books : books.filter((b) => b.category === category)),
    [category],
  );

  return (
    <section className="px-6 py-24 sm:px-10 bg-cream">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>ALL BOOKS</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          The <em className="italic">full shelf</em>.
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {(["all", "leadership", "personal", "family"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 font-ui text-[13px] uppercase transition-colors ${
                category === c ? "border-warm-500 bg-warm-500/15 text-ink-900" : "border-ink-900/10 bg-white/50 text-ink-600 hover:border-ink-900/20"
              }`}
              style={{ letterSpacing: "0.16em" }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <button key={b.id} type="button" onClick={() => setSelected(b)} className="text-left">
              <BookCover book={b} />
              <p className="mt-4 font-display text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>{b.title}</p>
              <p className="mt-1 font-ui text-eyebrow uppercase text-ink-400" style={{ letterSpacing: "0.2em" }}>
                {b.author} {b.status === "coming-soon" ? "\u00b7 coming" : b.year ? `\u00b7 ${b.year}` : ""}
              </p>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {books.filter((b) => b.status === "available").slice(0, 3).map((b) => (
            <FreeChapterCard key={b.id} book={b} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BookCover({ book, large = false }: { book: Book; large?: boolean }) {
  const w = large ? 260 : 180;
  const h = Math.round(w * 1.5);
  return (
    <div className="relative" style={{ width: w, height: h }}>
      <div className="absolute inset-0 rounded-xl shadow-[0_20px_60px_rgba(62,44,27,0.18)] overflow-hidden bg-warm-700">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-cream">
          <p className="font-ui text-eyebrow uppercase text-cream/60" style={{ letterSpacing: "0.2em" }}>{book.author}</p>
          <p className="mt-3 font-display" style={{ fontSize: large ? 28 : 20, fontWeight: 300, lineHeight: 1.05 }}>{book.title}</p>
          {book.status === "coming-soon" && (
            <p className="mt-3 rounded-full border border-cream/30 px-2.5 py-0.5 font-ui text-[10px] uppercase" style={{ letterSpacing: "0.2em" }}>Coming soon</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 p-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-[900px] overflow-auto rounded-3xl bg-cream p-8 md:p-12"
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full border border-ink-900/10 bg-white/70 p-2 font-ui text-ink-600 hover:border-warm-500" aria-label="Close">&times;</button>
        <div className="grid gap-8 md:grid-cols-[auto,1fr]">
          <BookCover book={book} />
          <div>
            <Eyebrow>{book.author.toUpperCase()}</Eyebrow>
            <h3 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(1.5rem,3.4vw,2.4rem)", fontWeight: 300, lineHeight: 1.05 }}>{book.title}</h3>
            <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600">{book.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {book.buyUrl && (
                <a href={book.buyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[14px] text-cream hover:-translate-y-0.5 transition-transform">Buy &rarr;</a>
              )}
              <a href={`#free-chapter-${book.id}`} onClick={onClose} className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 bg-white/50 px-5 py-2.5 font-ui text-[14px] text-ink-900">Free chapter</a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FreeChapterCard({ book }: { book: Book }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/book-chapter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bookSlug: book.id, email, name: name || undefined }),
      });
      const json = (await res.json()) as { ok: boolean };
      if (json.ok) setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <GlassCard id={`free-chapter-${book.id}`} className="p-6 text-center">
        <p className="font-display italic text-ink-900" style={{ fontSize: 20, fontWeight: 300 }}>Chapter 1 is on its way.</p>
        <p className="mt-2 font-body text-[13px] text-ink-600">Check your inbox for <span className="text-ink-900">{book.title}</span>.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard id={`free-chapter-${book.id}`} className="p-6">
      <p className="font-ui text-eyebrow uppercase text-warm-700" style={{ letterSpacing: "0.24em" }}>FREE CHAPTER</p>
      <p className="mt-2 font-display text-ink-900" style={{ fontSize: 20, fontWeight: 300 }}>{book.title}</p>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" className="rounded-2xl border border-ink-900/10 bg-white/80 px-3 py-2 font-ui text-[14px] outline-none focus:border-warm-500" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="rounded-2xl border border-ink-900/10 bg-white/80 px-3 py-2 font-ui text-[14px] outline-none focus:border-warm-500" />
        <button type="submit" disabled={submitting} className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-4 py-2 font-ui text-[13px] text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-60">{submitting ? "Sending\u2026" : "Send me chapter 1 \u2192"}</button>
      </form>
    </GlassCard>
  );
}

function AuthorQA() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#1B1008", color: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow className="text-cream/60">READERS</Eyebrow>
        <h2 className="mt-3 font-display" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Why this <em className="italic">mattered</em>.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <GlassCard key={t.name} dark className="p-7">
              <p className="font-display italic text-cream" style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.3 }}>&ldquo;{t.q}&rdquo;</p>
              <p className="mt-5 font-ui text-eyebrow uppercase text-cream/60" style={{ letterSpacing: "0.24em" }}>{t.name} &middot; {t.book}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudyGuidesSection() {
  const guides = books.filter((b) => b.status === "available");
  return (
    <section className="px-6 py-24 sm:px-10 bg-cream">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>STUDY GUIDES</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Read it <em className="italic">with a group</em>.
        </h2>
        <p className="mt-4 max-w-[58ch] font-body text-[16px] leading-relaxed text-ink-600">
          Every book comes with a companion study guide &mdash; free, designed for small groups, youth rooms, or Sunday classes.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((b) => (
            <GlassCard key={b.id} className="p-6">
              <p className="font-ui text-eyebrow uppercase text-warm-700" style={{ letterSpacing: "0.24em" }}>STUDY GUIDE</p>
              <p className="mt-2 font-display text-ink-900" style={{ fontSize: 20, fontWeight: 300 }}>{b.title}</p>
              <a href={`mailto:hello@futures.church?subject=${encodeURIComponent(`Study guide: ${b.title}`)}`} className="mt-4 inline-block font-ui text-[13px] text-warm-700 underline">Request PDF</a>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function BooksNewsletter() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#2A1B10", color: "#F7F1E6" }}>
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.2fr,1fr]">
        <div>
          <Eyebrow className="text-cream/60">NEXT RELEASE</Eyebrow>
          <h2 className="mt-3 font-display" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
            Be first for <em className="italic">Multiply or Die</em>.
          </h2>
          <p className="mt-5 max-w-[58ch] font-body text-[16px] leading-relaxed text-cream/80">
            Get notified the day it ships &mdash; plus the first chapter the week before. No marketing noise, just the writing.
          </p>
        </div>
        <ValueExchangeForm
          dark
          source="book-coming-soon-multiply-or-die"
          offer="Get the first chapter before launch."
          proofPoints={["One email when it ships", "First chapter a week early", "No marketing fluff"]}
          fields={["email", "name"]}
          cta="Put me on the list"
          outcome="We&rsquo;ll write the moment it drops."
        />
      </div>
    </section>
  );
}
