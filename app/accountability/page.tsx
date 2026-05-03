import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accountability",
  description:
    "Futures Church has practised financial accountability and clear child-protection standards for over a century. Our commitments and how to reach us.",
  openGraph: {
    title: "Accountability · Futures Church",
    description:
      "Our commitments to child safety, financial accountability, and clear governance — across 21 campuses in 4 countries since 1922.",
  },
};

// Restrained, confident, short. No enumerated protocols, no SLAs, no warranties.
// Credible assertions of commitment — nothing more, nothing less.

export default function AccountabilityPage() {
  return (
    <main className="bg-cream-200 text-ink-900">
      {/* HERO */}
      <section className="border-b border-ink-900/10">
        <div className="mx-auto max-w-shell px-6 py-32 sm:px-10 sm:py-40 lg:px-16">
          <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
            Accountability
          </p>
          <h1 className="mt-5 max-w-[24ch] font-display text-display-xl leading-[0.98] text-ink-900">
            What we&rsquo;re committed to.
          </h1>
          <p className="mt-8 max-w-[58ch] font-sans text-body-lg leading-relaxed text-ink-700">
            For over a hundred years Futures Church has built its practice around clear
            commitments: child safety, financial accountability, and transparent governance.
          </p>
        </div>
      </section>

      {/* 01 — CHILD SAFETY */}
      <SectionBlock id="child-safety" number="01" title="Child safety">
        <Lede>
          We follow clear child-protection practices in line with the relevant standards in each
          country we operate. Every adult serving with children or young people is screened,
          trained, and held accountable to our written safeguarding framework, which is reviewed
          annually.
        </Lede>

        <P>
          If you have a concern, you can speak with your campus pastor, email{" "}
          <a
            className="underline decoration-warm-500 underline-offset-2 hover:text-ink-900"
            href="mailto:safeguarding@futures.church"
          >
            safeguarding@futures.church
          </a>
          , or report it directly to the relevant authority in your jurisdiction.
        </P>
      </SectionBlock>

      {/* 02 — FINANCIAL ACCOUNTABILITY */}
      <SectionBlock id="finances" number="02" title="Financial accountability">
        <Lede>
          Futures Church has practised strong financial accountability across a century of
          ministry, and is independently audited each year in the USA and Australia.
        </Lede>

        <P>
          For finance questions, email{" "}
          <a
            className="underline decoration-warm-500 underline-offset-2 hover:text-ink-900"
            href="mailto:finance@futures.church"
          >
            finance@futures.church
          </a>
          .
        </P>
      </SectionBlock>

      {/* 03 — GOVERNANCE */}
      <SectionBlock id="governance" number="03" title="Governance">
        <Lede>
          Futures Church is a global church family with 21 campuses across Australia, the United
          States, Indonesia, and Venezuela. Authority and accountability flow through a clear
          pastoral and governance structure.
        </Lede>

        <Defn term="Global Senior Pastors">Ashley &amp; Jane Evans.</Defn>
        <Defn term="Australia Lead Pastors">Josh &amp; Sjhana.</Defn>
        <Defn term="Regional Boards">
          Each operating country has a registered governing board.
        </Defn>
        <Defn term="Campus Pastors">
          Each campus has a named campus pastor, accountable to regional Lead Pastors and through
          them to the Global Senior Pastors.
        </Defn>
      </SectionBlock>

      {/* META FOOTER */}
      <section className="bg-cream/60">
        <div className="mx-auto max-w-shell px-6 py-12 sm:px-10 lg:px-16">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-ink-500">
            Questions:{" "}
            <a
              className="underline decoration-warm-500 underline-offset-2 hover:text-ink-900"
              href="mailto:accountability@futures.church"
            >
              accountability@futures.church
            </a>
          </p>
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
