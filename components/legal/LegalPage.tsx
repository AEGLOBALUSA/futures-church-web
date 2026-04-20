import { Eyebrow } from "@/components/ui/Type";

export type LegalSection = { h: string; body: string[] };

export function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-ink-900 text-cream">
      <section
        className="px-6 pb-8 pt-32 sm:px-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(204,143,74,0.16) 0%, rgba(20,18,16,0) 60%), #0E0C0A",
        }}
      >
        <div className="mx-auto max-w-[820px]">
          <Eyebrow>{updated}</Eyebrow>
          <h1
            className="mt-3 font-display text-cream"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4rem)", fontWeight: 300, lineHeight: 1 }}
          >
            {title}.
          </h1>
          <p className="mt-5 max-w-[52ch] font-body text-[17px] leading-relaxed text-cream/70">
            {subtitle}
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 pt-8 sm:px-10">
        <div className="mx-auto max-w-[760px] space-y-12">
          {sections.map((s) => (
            <div key={s.h}>
              <h2
                className="font-display italic text-cream"
                style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.15 }}
              >
                {s.h}
              </h2>
              <div className="mt-4 space-y-4">
                {s.body.map((p, i) => (
                  <p
                    key={i}
                    className="font-body text-[15.5px] leading-relaxed text-cream/78"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
