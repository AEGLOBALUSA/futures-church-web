"use client";

import { useState } from "react";
import { books, type BookCategory } from "@/lib/content/books";
import { EmailCapture } from "@/components/ui/EmailCapture";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const categories: { value: "all" | BookCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "leadership", label: "Leadership" },
  { value: "personal", label: "Personal" },
  { value: "family", label: "Family" },
];

export default function BooksPage() {
  const [category, setCategory] = useState<"all" | BookCategory>("all");
  const filtered = category === "all" ? books : books.filter((b) => b.category === category);

  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Books</p>
          <h1 className="font-display text-6xl md:text-8xl text-ink-900 mb-6 leading-none">Words that build.</h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto">
            From Ashley and Jane Evans — books that change the way you lead, live, and love.
          </p>
        </div>
      </section>

      <section className="py-16 bg-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex gap-2 mb-12 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-5 py-2 rounded-full text-sm font-sans border transition-all ${
                  category === c.value
                    ? "bg-ember-400 text-ink-900 border-ember-400 font-medium"
                    : "border-ink-300 text-ink-500 hover:text-ink-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((book, i) => (
              <ScrollReveal key={book.id} delay={i * 0.07}>
                <div className="rounded-2xl bg-paper-100 border border-ink-300/50 overflow-hidden flex flex-col">
                  {/* Cover */}
                  <div className="aspect-[3/4] bg-gradient-to-b from-paper-200 to-paper-300 relative flex items-center justify-center p-8">
                    <div className="text-center">
                      <p className="font-display text-2xl text-ink-700 leading-tight mb-2">{book.title}</p>
                      <p className="font-sans text-sm text-ink-300">{book.author}</p>
                    </div>
                    {book.status === "coming-soon" && (
                      <div className="absolute top-4 right-4 bg-ember-400 text-ink-900 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full">
                        Coming Soon
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ember-300 mb-2 capitalize">
                      {book.category}
                    </p>
                    <h2 className="font-display text-2xl text-ink-900 mb-1">{book.title}</h2>
                    <p className="font-sans text-sm text-ink-500 mb-4">by {book.author}</p>
                    <p className="font-sans text-sm text-ink-500 leading-relaxed flex-1 mb-6">
                      {book.description}
                    </p>

                    {book.status === "available" && book.buyUrl ? (
                      <a href={book.buyUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ember" className="w-full justify-center">
                          Buy on Amazon
                        </Button>
                      </a>
                    ) : (
                      <div>
                        <p className="font-sans text-sm text-ink-500 mb-3">
                          Get notified when it launches:
                        </p>
                        <EmailCapture
                          source="book-waitlist"
                          interests={[book.id]}
                          placeholder="Your email"
                          ctaText="Notify me"
                          successMessage="We'll let you know the moment it's available."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
