import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Milo works",
  description:
    "Milo is the Futures Church guide — built on Claude by Anthropic. What he does, how he's made, and the commitments we've made about your conversations.",
  openGraph: {
    title: "How Milo works · Futures Church",
    description:
      "What Milo does, how he's made, and the commitments we've made about your conversations.",
  },
};

// Restrained, transparent, plain-spoken — same register as /accountability.
// Audience: the curious 5% who want to know what's under the hood, plus
// journalists, plus the visitor who's been burned by an unhelpful chatbot
// and wants to know this one's different.

export default function HowMiloWorksPage() {
  return (
    <main className="bg-cream-200 text-ink-900">
      {/* HERO */}
      <section className="border-b border-ink-900/10">
        <div className="mx-auto max-w-shell px-6 py-32 sm:px-10 sm:py-40 lg:px-16">
          <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
            How Milo works
          </p>
          <h1 className="mt-5 max-w-[24ch] font-display text-display-xl leading-[0.98] text-ink-900">
            Plain answers about your guide.
          </h1>
          <p className="mt-8 max-w-[58ch] font-sans text-body-lg leading-relaxed text-ink-700">
            Milo is the Futures Church guide. He answers questions about
            campuses, beliefs, kids&rsquo; programs, and how to plan a visit
            &mdash; and he can hand off to a real pastor whenever the moment
            calls for it.
          </p>
        </div>
      </section>

      {/* 01 — WHAT MILO DOES */}
      <SectionBlock id="what-milo-does" number="01" title="What Milo does">
        <Lede>
          Milo is built to answer the practical questions a first-time visitor,
          a long-time member, or a curious stranger might have about Futures
          Church.
        </Lede>
        <P>
          He knows the campus list, service times, who the pastors are, what
          we believe, and what to expect on a Sunday. He can guide you to the
          closest campus if you share your location, and he can hand you off
          to a real pastor for anything beyond his depth.
        </P>
        <P>
          He&rsquo;s not a counsellor. He&rsquo;s not a therapist. He&rsquo;s
          not a substitute for a phone call to a human when you need one.
        </P>
      </SectionBlock>

      {/* 02 — HOW MILO IS MADE */}
      <SectionBlock id="how-milo-is-made" number="02" title="How Milo is made">
        <Lede>
          Under the hood, Milo is built on{" "}
          <a
            href="https://www.anthropic.com/claude"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-warm-500 underline-offset-2 hover:text-ink-900"
          >
            Claude
          </a>
          , an AI model made by{" "}
          <a
            href="https://www.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-warm-500 underline-offset-2 hover:text-ink-900"
          >
            Anthropic
          </a>{" "}
          &mdash; one of the world&rsquo;s most safety-focused AI labs.
        </Lede>
        <P>
          Anthropic&rsquo;s research has shaped industry-wide standards on AI
          honesty, harmlessness, and refusal-to-deceive. We picked Claude
          specifically because of that record.
        </P>
        <P>
          Milo&rsquo;s knowledge of Futures Church &mdash; the campuses, the
          pastors, the beliefs, the rhythms &mdash; is supplied by us. The
          conversational ability is supplied by Claude. The combination is
          tuned, prompt-engineered, and tested by the Futures team.
        </P>
      </SectionBlock>

      {/* 03 — COMMITMENTS */}
      <SectionBlock id="commitments" number="03" title="What we&rsquo;ve decided">
        <Lede>
          A few things we&rsquo;ve made non-negotiable about how Milo works:
        </Lede>

        <Defn term="Your conversations stay yours">
          Your conversations with Milo are not used to train any AI model
          &mdash; ours, Anthropic&rsquo;s, or anyone else&rsquo;s.
        </Defn>

        <Defn term="No confident hallucinations">
          Milo will tell you when he doesn&rsquo;t know. He won&rsquo;t invent
          campus addresses, service times, or pastor names that don&rsquo;t
          exist. If he&rsquo;s unsure, he&rsquo;ll say so and offer to connect
          you with a real human.
        </Defn>

        <Defn term="Hand-off, not hold-on">
          For anything pastoral, urgent, or beyond his depth &mdash; grief,
          mental-health crises, abuse disclosures, deep theological questions
          &mdash; Milo will direct you to a real pastor or the appropriate
          emergency service. He won&rsquo;t try to handle what humans should.
        </Defn>

        <Defn term="Honest about being AI">
          If you ask Milo whether he&rsquo;s a person, he&rsquo;ll tell you
          plainly that he&rsquo;s an AI guide. He won&rsquo;t pretend to be
          someone he&rsquo;s not.
        </Defn>
      </SectionBlock>

      {/* META FOOTER */}
      <section className="bg-cream/60">
        <div className="mx-auto max-w-shell px-6 py-12 sm:px-10 lg:px-16">
          <div className="flex flex-wrap items-center justify-between gap-y-3">
            <p className="max-w-[58ch] font-display italic text-ink-700" style={{ fontSize: 15 }}>
              For how Milo handles your data, see our{" "}
              <Link
                href="/privacy"
                className="underline decoration-warm-500 underline-offset-2 hover:text-ink-900"
              >
                privacy policy
              </Link>
              .
            </p>
            <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-ink-500">
              Questions:{" "}
              <a
                className="underline decoration-warm-500 underline-offset-2 hover:text-ink-900"
                href="mailto:hello@futures.church"
              >
                hello@futures.church
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// ───────────────────────────── helpers ─────────────────────────────

function SectionBlock({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-ink-900/10">
      <div className="mx-auto max-w-shell px-6 py-24 sm:px-10 sm:py-28 lg:px-16">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[6rem_1fr]">
          <div>
            <p className="font-display text-display-md leading-none text-accent">{number}</p>
          </div>
          <div className="max-w-[64ch]">
            <h2 className="font-display text-display-md leading-[1.04] text-ink-900">{title}</h2>
            <div className="mt-8 space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Lede({ children }: { children: React.ReactNode }) {
  return <p className="font-display text-body-lg italic text-ink-700">{children}</p>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-body leading-[1.7] text-ink-700">{children}</p>;
}

function Defn({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-6 gap-y-1 sm:grid-cols-[14rem_1fr]">
      <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">{term}</p>
      <p className="font-sans text-body leading-[1.65] text-ink-700">{children}</p>
    </div>
  );
}
