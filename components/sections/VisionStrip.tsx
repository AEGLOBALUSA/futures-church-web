import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { visionStats } from "@/lib/content/vision";

export function VisionStrip() {
  return (
    <section className="relative bg-lemon py-24 md:py-32 grain-overlay overflow-hidden">
      <div className="relative mx-auto max-w-shell px-6 sm:px-12 lg:px-20 z-10">
        <div className="flex items-center justify-between mb-14">
          <p className="section-label text-obsidian-900">01 // THE VISION</p>
          <p className="section-label text-obsidian-900/70 hidden sm:block">BY THE NUMBERS</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-12">
          {visionStats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.08}>
              <div className="text-left">
                <p
                  className="font-display text-obsidian-900 leading-none tracking-[-0.02em] mb-3"
                  style={{ fontSize: "clamp(2.75rem, 5.5vw, 5.5rem)", fontWeight: 300 }}
                >
                  {stat.value}
                </p>
                <p className="font-sans font-medium text-[11px] uppercase tracking-eyebrow text-obsidian-900/70 mb-1">
                  {stat.label}
                </p>
                <p className="text-[13px] text-obsidian-900/80 font-sans leading-snug">
                  {stat.sub}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
