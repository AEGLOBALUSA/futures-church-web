import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { books } from "@/lib/content/books";
import { Button } from "@/components/ui/Button";

const coverAccents = ["bg-violet", "bg-pink", "bg-sky", "bg-copper", "bg-thistle"];

export function BooksRail() {
  return (
    <section className="py-24 md:py-40 bg-obsidian-800">
      <div className="mx-auto max-w-shell px-6 sm:px-12 lg:px-20">
        <ScrollReveal>
          <div className="flex items-start justify-between mb-16 flex-wrap gap-6">
            <div className="max-w-display">
              <p className="section-label text-bone/60 mb-5">03 // BOOKS</p>
              <h2
                className="font-display text-bone leading-[0.95] tracking-[-0.015em]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 300 }}
              >
                Words that <em className="text-pink not-italic">build faith</em>.
              </h2>
            </div>
            <Link href="/books" className="self-end">
              <Button variant="secondary">See all books →</Button>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {books.map((book, i) => (
            <ScrollReveal key={book.id} delay={i * 0.07}>
              <div className="group flex flex-col">
                <div className={`aspect-[2/3] rounded-xl relative overflow-hidden mb-4 ${coverAccents[i % coverAccents.length]}`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                    <span className="font-display text-xl text-bone leading-tight" style={{ fontWeight: 300 }}>
                      {book.title}
                    </span>
                    <span className="font-sans text-xs text-bone/70 mt-2">{book.author}</span>
                  </div>
                  {book.status === "coming-soon" && (
                    <div className="absolute top-2 right-2 bg-lemon text-obsidian-900 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Soon
                    </div>
                  )}
                </div>
                <p className="font-sans text-sm font-medium text-bone leading-snug mb-1">
                  {book.title}
                </p>
                <p className="font-sans text-xs text-bone/50 mb-3">{book.author}</p>
                {book.status === "available" && book.buyUrl ? (
                  <a href={book.buyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm" className="text-xs w-full justify-center">
                      Buy now
                    </Button>
                  </a>
                ) : (
                  <Link href="/books">
                    <Button variant="secondary" size="sm" className="text-xs w-full justify-center">
                      Join waitlist
                    </Button>
                  </Link>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
