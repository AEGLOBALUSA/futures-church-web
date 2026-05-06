// HomeNumbers — stats band from the Claude Design draft
// 21 campuses · 19.5k family · 4 languages · since 1922
// Placed above HomeInvitation as a dark accent band.

const STATS = [
  { num: "21", label: "active campuses · +5 in 2026" },
  { num: "19.5k", label: "family gathered every Sunday" },
  { num: "4", label: "languages on Sunday" },
  { num: "1922", label: "Magill, SA — year one" },
  ];

export function HomeNumbers() {
    return (
          <section
                  aria-label="Futures Church by the numbers"
                  style={{
                            background: "#1C1A17",
                            padding: "56px 0",
                  }}
                >
                <div
                          className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16"
                          style={{
                                      display: "grid",
                                      gridTemplateColumns: "repeat(2, 1fr)",
                                      gap: "2px",
                          }}
                        >
                  {STATS.map((s) => (
                                    <div
                                                  key={s.num}
                                                  className="px-6 py-8 sm:px-10 lg:px-12"
                                                  style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
                                                >
                                                <div
                                                                className="font-display"
                                                                style={{
                                                                                  color: "#FDFBF6",
                                                                                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                                                                                  fontWeight: 300,
                                                                                  letterSpacing: "-0.02em",
                                                                                  lineHeight: 1,
                                                                }}
                                                              >
                                                  {s.num}
                                                              <span style={{ color: "#C8906B" }}>.</span>span>
                                                </div>div>
                                                <div
                                                                className="mt-2 font-sans"
                                                                style={{
                                                                                  color: "rgba(253,251,246,0.5)",
                                                                                  fontSize: 13,
                                                                                  letterSpacing: "0.12em",
                                                                                  textTransform: "uppercase",
                                                                }}
                                                              >
                                                  {s.label}
                                                </div>div>
                                    </div>div>
                                  ))}
                </div>div>
          </section>section>
        );
}
</section>
