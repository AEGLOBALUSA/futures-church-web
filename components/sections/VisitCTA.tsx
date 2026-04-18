import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Button } from "@/components/ui/Button";

export function VisitCTA() {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden bg-violet grain-overlay">
      <div
        aria-hidden
        className="aurora-blob bg-pink"
        style={{ top: "-30%", left: "10%", width: "60vw", height: "60vw" }}
      />
      <div
        aria-hidden
        className="aurora-blob bg-lemon"
        style={{ bottom: "-40%", right: "-10%", width: "55vw", height: "55vw", opacity: 0.35, animationDelay: "-6s" }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <p className="section-label text-bone/70 mb-8">06 // YOU BELONG HERE</p>
          <h2
            className="font-display text-bone mb-8 leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)", fontWeight: 300 }}
          >
            Come <em className="text-lemon not-italic">home</em>.
          </h2>
          <p className="font-sans text-body-lg text-bone/80 max-w-prose mx-auto mb-12 leading-[1.55]">
            Whatever you&apos;re carrying, whatever you&apos;ve been through — there&apos;s a place for you at Futures Church.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan-a-visit">
              <Button variant="lemon" size="lg">
                Plan a visit →
              </Button>
            </Link>
            <Link href="/campuses">
              <Button variant="secondary" size="lg">
                Find a campus
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
