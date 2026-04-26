/**
 * US Accreditation Note — renders in the `usAccreditationSlot` on the college
 * page when accessed from a US context. Informs prospective US students about
 * the accreditation pathway and credit-transfer options.
 *
 * This slot is shown via the host-conditional logic in app/college/page.tsx.
 * Currently always rendered (no geo-gating) as a visible notice for all
 * visitors; geo-aware rendering is a Phase 4 enhancement.
 */

export function USAccreditationNote() {
  return (
    <div className="mx-auto max-w-[1200px] px-0 py-5">
      <div
        className="flex flex-wrap items-start gap-3 rounded-[16px] px-6 py-4"
        style={{
          background: "rgba(28,26,23,0.04)",
          border: "1px solid rgba(28,26,23,0.08)",
        }}
      >
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-ui text-[11px] font-bold"
          style={{ background: "#4E5D3F", color: "#FDFBF6" }}
          aria-hidden
        >
          ✓
        </span>
        <div>
          <p
            className="font-ui text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "#4E5D3F" }}
          >
            US Students — Alphacrucis College is TEQSA-registered and
            internationally recognised
          </p>
          <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13, lineHeight: 1.6 }}>
            Credits from Futures Leadership College may be transferable toward
            degrees at partnering US institutions. Speak to your admissions
            advisor for a formal credit evaluation before enrolling.
          </p>
        </div>
      </div>
    </div>
  );
}
