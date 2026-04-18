import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const tiles = [
  {
    href: "/women",
    label: "bU Women",
    eyebrow: "Women",
    desc: "Jane Evans' movement for women who are done with small.",
    bg: "bg-pink",
    text: "text-bone",
  },
  {
    href: "/dreamers",
    label: "Dreamers",
    eyebrow: "Youth",
    desc: "For the generation that's about to change everything.",
    bg: "bg-violet",
    text: "text-bone",
  },
  {
    href: "/kids",
    label: "Kids",
    eyebrow: "Children",
    desc: "Safe, biblical, and genuinely great Sundays for kids.",
    bg: "bg-sky",
    text: "text-obsidian-900",
  },
  {
    href: "/college",
    label: "Global College",
    eyebrow: "Leadership",
    desc: "Outthink. Outbuild. Outlead. Applications open Sept 2026.",
    bg: "bg-lemon",
    text: "text-obsidian-900",
  },
];

export function FamilyTeaser() {
  return (
    <section className="py-24 md:py-40 bg-obsidian-900">
      <div className="mx-auto max-w-shell px-6 sm:px-12 lg:px-20">
        <ScrollReveal>
          <div className="mb-16 max-w-display">
            <p className="section-label text-bone/60 mb-5">04 // PART OF THE FAMILY</p>
            <h2
              className="font-display text-bone leading-[0.95] tracking-[-0.015em]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 300 }}
            >
              Something for <em className="text-lemon not-italic">everyone</em>.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {tiles.map((tile, i) => (
            <ScrollReveal key={tile.href} delay={i * 0.08}>
              <Link
                href={tile.href}
                className={`group block rounded-2xl overflow-hidden relative aspect-[4/5] hover:-translate-y-1 transition-all duration-500 ease-apple ${tile.bg}`}
              >
                <div className={`absolute inset-0 p-6 flex flex-col justify-between ${tile.text}`}>
                  <p className="section-label opacity-70">{tile.eyebrow.toUpperCase()}</p>
                  <div>
                    <h3
                      className="font-display mb-2 leading-[0.95]"
                      style={{ fontSize: "clamp(1.75rem, 2.5vw, 2.75rem)", fontWeight: 300 }}
                    >
                      {tile.label}
                    </h3>
                    <p className="font-sans text-sm opacity-85 leading-snug hidden md:block">
                      {tile.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
