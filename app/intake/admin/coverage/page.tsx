import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { getAllSlotsWithStatus } from "@/lib/content/slots/server";
import { groupSlotsByPage } from "@/lib/content/slots/registry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Edits — coverage",
  robots: { index: false, follow: false },
};

export default async function CoveragePage() {
  if (!(await isAdminAuthed())) redirect("/intake/admin/login");

  const slots = await getAllSlotsWithStatus();
  const total = slots.length;
  const filled = slots.filter((s) => s.status === "filled").length;
  const draft = slots.filter((s) => s.status === "draft").length;
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

  // Group by page for the main grid.
  const groups = groupSlotsByPage();
  const pageOrder = Array.from(groups.keys());

  // Group by owner for the side panel.
  const byOwner = new Map<string, { total: number; filled: number }>();
  for (const s of slots) {
    const o = s.owner;
    const existing = byOwner.get(o) ?? { total: 0, filled: 0 };
    existing.total += 1;
    if (s.status === "filled") existing.filled += 1;
    byOwner.set(o, existing);
  }

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-shell items-center gap-4 px-5 py-3 sm:px-8">
          <Link
            href="/intake/admin"
            className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900"
          >
            ← Dashboard
          </Link>
          <span className="ml-auto font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            Edits · site-wide content slots
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-5 pb-32 pt-12 sm:px-8 sm:pt-16">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">Edits</p>
        <h1 className="mt-3 font-display text-display-xl leading-[0.96] text-ink-900">
          What still needs writing.
        </h1>
        <p className="mt-5 max-w-prose font-display text-body-lg italic text-ink-700">
          Every editable copy slot on the site. The default owner is Josh
          Greenwood (or appointee) — Josh re-delegates anything he doesn&rsquo;t
          want to write himself. Click any slot to open the page in edit mode,
          where the slot will be highlighted and ready to fill.
        </p>

        {/* Top stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Tile label="Filled" value={filled} accent="#3F7B4E" />
          <Tile label="Draft" value={draft} accent="#C8906B" />
          <Tile label="Empty" value={total - filled - draft} accent="#B85C3B" />
          <Tile label={`${pct}% coverage`} value={`${filled}/${total}`} />
        </div>

        {/* Owner breakdown */}
        <section className="mt-14">
          <h2 className="font-ui text-[10px] uppercase tracking-[0.28em] text-ink-500">
            By owner
          </h2>
          <ul className="mt-4 space-y-2">
            {Array.from(byOwner.entries())
              .sort((a, b) => b[1].total - a[1].total)
              .map(([ownerName, { total: t, filled: f }]) => (
                <li
                  key={ownerName}
                  className="flex items-center gap-4 rounded-2xl border border-ink-900/10 bg-cream/95 px-5 py-3"
                >
                  <span className="font-display italic text-ink-900" style={{ fontSize: 16 }}>
                    {ownerName}
                  </span>
                  <span className="ml-auto font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500">
                    {f} / {t} done
                  </span>
                </li>
              ))}
          </ul>
        </section>

        {/* By page */}
        <section className="mt-14">
          <h2 className="font-ui text-[10px] uppercase tracking-[0.28em] text-ink-500">
            By page
          </h2>
          <div className="mt-6 space-y-10">
            {pageOrder.map((pageTitle) => {
              const pageSlots = groups.get(pageTitle) ?? [];
              const slotsForPage = slots.filter((s) =>
                pageSlots.some((p) => p.id === s.id)
              );
              const pageFilled = slotsForPage.filter((s) => s.status === "filled").length;
              const pageRoute = pageSlots[0]?.page ?? "/";
              return (
                <article key={pageTitle}>
                  <header className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>
                      {pageTitle}
                    </h3>
                    <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
                      {pageFilled} / {slotsForPage.length} filled
                    </span>
                    <Link
                      href={`${pageRoute}?review=1`}
                      className="font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700 hover:text-ink-900"
                    >
                      Open page →
                    </Link>
                  </header>
                  <ul className="mt-4 divide-y divide-ink-900/5 rounded-3xl border border-ink-900/10 bg-cream/95">
                    {slotsForPage.map((s) => (
                      <li key={s.id} className="flex items-start gap-4 px-5 py-4">
                        <span
                          aria-hidden
                          className="mt-2 size-2 shrink-0 rounded-full"
                          style={{
                            background:
                              s.status === "filled"
                                ? "#3F7B4E"
                                : s.status === "draft"
                                ? "#C8906B"
                                : "rgba(184,92,59,0.5)",
                          }}
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block font-display italic text-ink-900" style={{ fontSize: 16, fontWeight: 300 }}>
                            {s.definition.field}
                          </span>
                          <span className="mt-0.5 block font-sans text-body-sm text-ink-500">
                            {s.owner}
                            {s.definition.wordBudget && (
                              <> · {s.definition.wordBudget}</>
                            )}
                            {s.updatedAt && (
                              <> · last edit {new Date(s.updatedAt).toLocaleDateString()}</>
                            )}
                          </span>
                        </span>
                        <Link
                          href={`${s.definition.page}?review=1#slot-${encodeURIComponent(s.id)}`}
                          className="shrink-0 font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700 hover:text-ink-900"
                        >
                          {s.status === "filled" ? "Review" : "Fill"} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function Tile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream/95 px-5 py-4">
      <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">{label}</span>
      <div
        className="mt-2 font-display text-display-md leading-none"
        style={{ color: accent ?? "#1C1A17" }}
      >
        {value}
      </div>
    </div>
  );
}
