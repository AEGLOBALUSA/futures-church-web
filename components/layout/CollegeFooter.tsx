import Link from "next/link";

const LINKS = [
  { href: "/college", label: "College home" },
  { href: "/college#streams", label: "Three streams" },
  { href: "/college#programme", label: "Programme" },
  { href: "/college#faculty", label: "Faculty" },
  { href: "/college#apply-form", label: "Apply" },
  { href: "/privacy", label: "Privacy" },
  { href: "/accessibility", label: "Accessibility" },
];

export function CollegeFooter() {
  return (
    <footer
      className="border-t border-white/10 px-6 py-12 sm:px-10"
      style={{ background: "#14120F", color: "#FDFBF6" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div>
            <p className="font-display" style={{ fontSize: 20, fontWeight: 300, letterSpacing: "-0.01em" }}>
              Futures <em className="italic" style={{ color: "#C89A3C" }}>College</em>
            </p>
            <p className="mt-2 font-ui text-[11px] uppercase tracking-[0.2em] opacity-40">
              Part of Futures Church · futuresglobal.college
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-ui text-[11px] uppercase tracking-[0.18em] opacity-50 transition-opacity hover:opacity-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 font-ui text-[10px] uppercase tracking-[0.16em] opacity-30">
          © {new Date().getFullYear()} Futures Global. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
