"use client";

import { Eyebrow, Hero, Sub } from "@/components/ui/Type";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIInput } from "@/components/ai/AIInput";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import voices from "@/content/voices.json";

export default function FoundationQAPage() {
  return (
    <main className="min-h-screen bg-cream text-ink-900">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10">
        <Eyebrow>Round 0 · Foundation QA</Eyebrow>
        <Hero className="mt-4">
          Every primitive, <em className="italic">in one room</em>.
        </Hero>
        <Sub className="mt-6 max-w-[60ch]">
          A developer scratchpad. Confirms tokens, typography, glass, AI surface,
          forms, and voices all render the same way they&rsquo;ll ship.
        </Sub>

        <section className="mt-20 grid gap-8 sm:grid-cols-3">
          {[
            { name: "cream",     hex: "#FDFBF6" },
            { name: "warm-300",  hex: "#D9BFA0" },
            { name: "warm-500",  hex: "#C8906B" },
            { name: "warm-700",  hex: "#8A5A3C" },
            { name: "ink-900",   hex: "#1C1A17" },
            { name: "ink-600",   hex: "#534D44" },
            { name: "ink-400",   hex: "#8A8178" },
            { name: "glass-bg",  hex: "rgba(255,252,247,0.72)" },
            { name: "glass-border", hex: "rgba(255,255,255,0.5)" },
          ].map((c) => (
            <div key={c.name} className="rounded-2xl border border-ink-900/10 p-5">
              <div
                className="mb-3 h-16 rounded-xl border border-ink-900/5"
                style={{ background: c.hex }}
              />
              <p className="font-ui text-sm text-ink-900">{c.name}</p>
              <p className="font-ui text-xs text-ink-600">{c.hex}</p>
            </div>
          ))}
        </section>

        <section className="mt-24 space-y-6">
          <Eyebrow>Typography</Eyebrow>
          <Hero as="h2">
            Hero with <em className="italic">italic</em> bite.
          </Hero>
          <Sub>
            Sub copy sits beneath the hero. Fraunces display, Inter Tight ui,
            Tiempos (Fraunces fallback) body. Kern lightly. Breathe often.
          </Sub>
        </section>

        <section className="mt-24">
          <Eyebrow>AI surface</Eyebrow>
          <div className="mt-6">
            <AIInput
              placeholder="Ask anything about Futures…"
              chips={[
                "I'm new — where do I start?",
                "Find my closest campus",
                "What's Sunday like with kids?",
                "I'm going through a hard time",
              ]}
            />
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-2">
          <div>
            <Eyebrow>GlassCard · light</Eyebrow>
            <GlassCard breathe className="mt-4 p-8">
              <p className="font-display italic" style={{ fontSize: 28, fontWeight: 300 }}>
                A cream card, breathing softly.
              </p>
              <p className="mt-3 font-ui text-sm text-ink-600">
                glass-bg, glass-border, backdrop-blur-glass, animate-glass-breathe.
              </p>
            </GlassCard>
          </div>
          <div>
            <Eyebrow>GlassCard · dark</Eyebrow>
            <GlassCard dark breathe className="mt-4 p-8">
              <p className="font-display italic" style={{ fontSize: 28, fontWeight: 300 }}>
                A dark card, same rhythm.
              </p>
              <p className="mt-3 font-ui text-sm opacity-70">
                Same primitive, dark-surface variant for hero overlays.
              </p>
            </GlassCard>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-2">
          <div>
            <Eyebrow>ValueExchangeForm</Eyebrow>
            <ValueExchangeForm
              className="mt-4"
              source="dev_foundation_qa"
              offer="A dev QA form — not a real offer."
              proofPoints={["Logs to console if no CRM_ENDPOINT", "Round 0 primitive", "Safe to submit"]}
              fields={["email", "city", "oneThing"]}
              cta="Send it"
              outcome="Received. Check /api/capture logs."
            />
          </div>
          <div>
            <Eyebrow>Voices</Eyebrow>
            <div className="mt-4 flex flex-col gap-3">
              {voices.slice(0, 5).map((v) => (
                <GlassCard key={v.name} className="p-5">
                  <p
                    className="font-display italic"
                    style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.4 }}
                  >
                    “{v.quote}”
                  </p>
                  <p className="mt-3 font-ui text-xs uppercase tracking-[0.22em] text-ink-600">
                    {v.name} · {v.role} · {v.campus}
                  </p>
                </GlassCard>
              ))}
              <p className="font-ui text-xs text-ink-600">
                {voices.length} voices in content/voices.json
              </p>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <Eyebrow>Dock</Eyebrow>
          <Sub className="mt-3">
            The floating Guide dock lives in the bottom-right. It&rsquo;s rendered by
            the root layout for every page, including this one.
          </Sub>
        </section>

        <div className="mt-24 border-t border-ink-900/10 pt-6">
          <p className="font-ui text-xs text-ink-600">
            /dev/foundation · Round 0 sign-off surface. Not linked from Nav.
          </p>
        </div>
      </div>
    </main>
  );
}
