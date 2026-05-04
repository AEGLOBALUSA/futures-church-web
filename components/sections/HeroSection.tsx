import { AIGuideHero } from "@/components/ai-guide/AIGuideHero";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-violet grain-overlay pt-28 pb-20 sm:pt-36 sm:pb-24"
      style={{ minHeight: "clamp(780px, 94vh, 1180px)" }}
    >
      {/* Aurora blobs — multi-colour motion to kill any flat-poster feel. */}
      <div
        aria-hidden
        className="aurora-blob bg-pink"
        style={{ top: "-10%", left: "-8%", width: "55vw", height: "55vw" }}
      />
      <div
        aria-hidden
        className="aurora-blob bg-sky"
        style={{ bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", animationDelay: "-6s" }}
      />
      <div
        aria-hidden
        className="aurora-blob bg-lemon"
        style={{ top: "40%", left: "55%", width: "28vw", height: "28vw", opacity: 0.3, animationDelay: "-12s" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-shell px-6 sm:px-10 lg:px-14">
        {/* Section label + live dot */}
        <div className="flex items-center justify-between mb-14 sm:mb-20">
          <p className="section-label text-bone">00 // A HOME FOR EVERYONE</p>
          <div className="flex items-center gap-2.5 text-bone/80 section-label">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-lemon" />
            <span>your guide · live</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Headline — left column */}
          <div className="lg:col-span-5">
            <h1
              className="font-display text-bone leading-[0.88] tracking-tight"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)" }}
            >
              A home<br />
              for <em className="text-lemon not-italic">everyone</em>.
            </h1>

            <p className="mt-8 font-sans text-bone/75 text-[17px] sm:text-[18px] leading-[1.55] max-w-md">
              Every race. Every age. Every stage. One culture. Ask Milo —
              our always-on guide answers in real time, and a real pastor is never far away.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5 section-label text-bone/60">
              <span>21 CAMPUSES</span>
              <span className="w-1 h-1 rounded-full bg-bone/40" />
              <span>5 NATIONS</span>
              <span className="w-1 h-1 rounded-full bg-bone/40" />
              <span>1 FAMILY</span>
            </div>
          </div>

          {/* AI Guide — right column, centerpiece */}
          <div className="lg:col-span-7">
            <AIGuideHero />
          </div>
        </div>
      </div>
    </section>
  );
}
