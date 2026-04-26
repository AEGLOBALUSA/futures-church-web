import type { Metadata } from "next";
import { Download } from "lucide-react";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";

export const metadata: Metadata = {
  title: "Press — Futures Church",
  description:
    "Media kit, logos, approved photography, fact sheet, and interview booking for Futures Church.",
};

const BRAND_ASSETS = [
  { label: "Logo — Light (SVG)", href: "PLACEHOLDER — Add logo file URL", placeholder: true },
  { label: "Logo — Dark (SVG)", href: "PLACEHOLDER — Add logo file URL", placeholder: true },
  { label: "Logo — Mono (SVG)", href: "PLACEHOLDER — Add logo file URL", placeholder: true },
  { label: "Logo pack (PNG, all variants)", href: "PLACEHOLDER — Add zip URL", placeholder: true },
  { label: "Brand colors + typography spec (PDF)", href: "PLACEHOLDER — Add file URL", placeholder: true },
];

const PHOTO_ASSETS = [
  { label: "Ashley Evans — Hi-res portrait", href: "PLACEHOLDER — Add file URL", placeholder: true },
  { label: "Jane Evans — Hi-res portrait", href: "PLACEHOLDER — Add file URL", placeholder: true },
  { label: "Josh Evans — Hi-res portrait", href: "PLACEHOLDER — Add file URL", placeholder: true },
  { label: "Sjhana Evans — Hi-res portrait", href: "PLACEHOLDER — Add file URL", placeholder: true },
  { label: "Approved campus photography (ZIP)", href: "PLACEHOLDER — Add file URL", placeholder: true },
  { label: "One-page fact sheet (PDF)", href: "PLACEHOLDER — Add file URL", placeholder: true },
];

const FACTS = [
  { label: "Founded", value: "1922" },
  { label: "Global Senior Pastors", value: "Ashley & Jane Evans" },
  { label: "Australia Lead Pastors", value: "Josh & Sjhana Evans" },
  { label: "Active campuses", value: "21" },
  { label: "Countries", value: "4 (Australia, USA, Indonesia, Venezuela launching)" },
  { label: "Daily Word subscribers", value: "300,000+" },
  { label: "Headquarters", value: "Adelaide, South Australia" },
  { label: "Media contact", value: "PLACEHOLDER — press@futures.church" },
];

export default function PressPage() {
  return (
    <main className="bg-cream text-ink-900">
      {/* Hero */}
      <section
        className="px-6 pb-16 pt-32 sm:px-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,143,74,0.12) 0%, transparent 60%), #FDFBF6",
        }}
      >
        <div className="mx-auto max-w-[820px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Press
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            Everything you need
            <br />
            <em className="italic">to tell the story well.</em>
          </h1>
          <p className="mt-6 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            Logos, photos, fact sheet, and interview booking — all in one place.
            Questions? Our comms team responds within three business days.
          </p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10" style={{ background: "#F7F0E4" }}>
        <div className="mx-auto max-w-[900px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Quick facts
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FACTS.map((f) => (
              <div key={f.label} className="flex gap-4 rounded-xl border border-ink-900/10 bg-cream p-4">
                <p className="w-36 shrink-0 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">{f.label}</p>
                <p
                  className={`font-sans ${f.value.startsWith("PLACEHOLDER") ? "italic text-warm-600" : "text-ink-900"}`}
                  style={{ fontSize: 14 }}
                >
                  {f.value.startsWith("PLACEHOLDER") ? `⚠ ${f.value}` : f.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 p-4 text-center">
            <p className="font-ui text-[11px] text-warm-600">⚠ Complete the fact sheet — Section K of the staff questionnaire.</p>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-[900px] space-y-12">
          {[
            { heading: "Brand assets", items: BRAND_ASSETS },
            { heading: "Photography + documents", items: PHOTO_ASSETS },
          ].map((group) => (
            <div key={group.heading}>
              <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
                {group.heading}
              </p>
              <div className="mt-6 space-y-3">
                {group.items.map((asset) => (
                  <div
                    key={asset.label}
                    className="flex items-center justify-between rounded-xl border border-ink-900/10 bg-white/60 px-5 py-4"
                  >
                    <p className="font-sans text-ink-900" style={{ fontSize: 14 }}>
                      {asset.label}
                    </p>
                    {asset.placeholder ? (
                      <span className="font-ui text-[11px] uppercase tracking-[0.14em] text-warm-500">
                        ⚠ Pending
                      </span>
                    ) : (
                      <a
                        href={asset.href}
                        download
                        className="inline-flex items-center gap-1.5 font-ui text-[12px] uppercase tracking-[0.14em] text-ink-600 transition-colors hover:text-warm-600"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interview booking */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10" style={{ background: "#F7F0E4" }}>
        <div className="mx-auto max-w-[640px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Interview requests
          </p>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
          >
            Book an interview.
          </h2>
          <p className="mt-4 font-sans text-ink-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
            We respond to all media enquiries within three business days. Include your outlet,
            deadline, and angle in the message below.
          </p>
          <div className="mt-8">
            <ValueExchangeForm
              offer="Tell us about your story and we'll connect you with the right person."
              proofPoints={["3 business day response", "Routes directly to our comms team"]}
              fields={["name", "email"]}
              cta="Send enquiry"
              outcome="Our comms team will be in touch within 3 business days."
              source="press-interview"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
