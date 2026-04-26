"use client";

import { useState, useRef } from "react";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { useEffect } from "react";

export function PrayerPageClient() {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("contact"), [setPageContext]);

  const [anon, setAnon] = useState(false);
  const [sharePublic, setSharePublic] = useState(false);
  const [pastoralCall, setPastoralCall] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prayer, setPrayer] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: anon ? "Anonymous" : name,
          email: anon ? "" : email,
          prayer,
          anonymous: anon,
          sharePublic,
          pastoralCall,
        }),
      });
      if (res.ok) {
        setStatus("done");
        formRef.current?.reset();
        setPrayer("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

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
            Prayer
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            You don&apos;t have to
            <br />
            <em className="italic">carry this alone.</em>
          </h1>
          <p className="mt-6 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            Every request is read by a real person. Our pastoral care team prays over
            every submission — and responds the same day.
          </p>
        </div>
      </section>

      {/* Two columns: form + wall */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div>
            <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
              Submit a request
            </p>
            <h2
              className="mt-3 font-display text-ink-900"
              style={{ fontSize: "clamp(1.5rem,2.8vw,2.25rem)", fontWeight: 300 }}
            >
              What&apos;s on your heart?
            </h2>

            {status === "done" ? (
              <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white/70 p-8">
                <p className="font-display text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>
                  We have it.
                </p>
                <p className="mt-3 font-sans text-ink-600" style={{ fontSize: 15, lineHeight: 1.65 }}>
                  A pastor will be praying for you today. If you asked for a call, expect to hear
                  from someone at your campus before end of day.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Anonymous toggle */}
                <label className="flex cursor-pointer items-center gap-3">
                  <span
                    onClick={() => setAnon(!anon)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${anon ? "bg-ink-900" : "bg-ink-900/20"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-cream shadow transition-transform ${anon ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </span>
                  <span className="font-sans text-ink-700" style={{ fontSize: 14 }}>
                    Submit anonymously
                  </span>
                </label>

                {!anon && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block font-ui text-[11px] uppercase tracking-[0.18em] text-ink-600" htmlFor="prayer-name">
                        Name
                      </label>
                      <input
                        id="prayer-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-ink-900/15 bg-white/60 px-4 py-3 font-sans text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none"
                        style={{ fontSize: 15 }}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block font-ui text-[11px] uppercase tracking-[0.18em] text-ink-600" htmlFor="prayer-email">
                        Email
                      </label>
                      <input
                        id="prayer-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-ink-900/15 bg-white/60 px-4 py-3 font-sans text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none"
                        style={{ fontSize: 15 }}
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-ui text-[11px] uppercase tracking-[0.18em] text-ink-600" htmlFor="prayer-text">
                    Your prayer request
                  </label>
                  <textarea
                    id="prayer-text"
                    required
                    rows={5}
                    value={prayer}
                    onChange={(e) => setPrayer(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-ink-900/15 bg-white/60 px-4 py-3 font-sans text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none"
                    style={{ fontSize: 15, lineHeight: 1.6, resize: "vertical" }}
                    placeholder="Write whatever is on your heart…"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={sharePublic}
                      onChange={(e) => setSharePublic(e.target.checked)}
                      className="h-4 w-4 rounded border-ink-900/20 accent-ink-900"
                    />
                    <span className="font-sans text-ink-600" style={{ fontSize: 14 }}>
                      Share on the prayer wall (others can see and pray for this)
                    </span>
                  </label>
                  {!anon && (
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={pastoralCall}
                        onChange={(e) => setPastoralCall(e.target.checked)}
                        className="h-4 w-4 rounded border-ink-900/20 accent-ink-900"
                      />
                      <span className="font-sans text-ink-600" style={{ fontSize: 14 }}>
                        I&apos;d like a pastor to call me
                      </span>
                    </label>
                  )}
                </div>

                {status === "error" && (
                  <p className="font-sans text-red-600" style={{ fontSize: 14 }}>
                    Something went wrong — please try again or email prayer@futures.church.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending" || !prayer.trim()}
                  className="rounded-full bg-ink-900 px-8 py-3.5 font-ui text-[13px] tracking-[0.02em] text-cream transition-all hover:bg-warm-600 disabled:opacity-50"
                >
                  {status === "sending" ? "Sending…" : "Send my prayer →"}
                </button>

                <p className="font-sans text-[12px] text-ink-400">
                  Every request is read by a real pastor. We respond the same day.
                </p>
              </form>
            )}
          </div>

          {/* Prayer wall — placeholder */}
          <div>
            <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
              Prayer wall
            </p>
            <h2
              className="mt-3 font-display text-ink-900"
              style={{ fontSize: "clamp(1.5rem,2.8vw,2rem)", fontWeight: 300 }}
            >
              Praying with you.
            </h2>
            <div className="mt-6 rounded-2xl border border-dashed border-warm-400/60 bg-warm-50/50 p-8 text-center">
              <p className="font-ui text-[12px] uppercase tracking-[0.2em] text-warm-600">
                ⚠ Coming soon
              </p>
              <p className="mt-3 font-sans text-ink-500" style={{ fontSize: 14, lineHeight: 1.65 }}>
                The public prayer wall — where you can see shared requests and tap &ldquo;I&apos;ll pray for
                this&rdquo; — is being built. Submit your request using the form and we&apos;ll pray regardless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis bar */}
      <section className="border-t border-ink-900/10 px-6 py-8 sm:px-10" style={{ background: "#1C1A17" }}>
        <div className="mx-auto max-w-[900px] flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-cream/60">Crisis lines</p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:988" className="font-sans text-cream underline-offset-2 hover:underline" style={{ fontSize: 14 }}>
              US &amp; Canada — 988
            </a>
            <a href="tel:131114" className="font-sans text-cream underline-offset-2 hover:underline" style={{ fontSize: 14 }}>
              Australia — 13 11 14
            </a>
            <a href="tel:119" className="font-sans text-cream underline-offset-2 hover:underline" style={{ fontSize: 14 }}>
              Indonesia — 119 ext 8
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
