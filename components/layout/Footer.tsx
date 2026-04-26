import Link from "next/link";
import { Instagram, Facebook, Youtube, Music2 } from "lucide-react";
import progress from "@/content/vision/progress.json";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Campus",
    links: [
      { href: "/plan-a-visit", label: "Plan a visit" },
      { href: "/campuses", label: "Find a campus" },
      { href: "/watch", label: "Watch live" },
    ],
  },
  {
    heading: "Family",
    links: [
      { href: "/women", label: "bU Women" },
      { href: "/dreamers", label: "Dreamers" },
      { href: "/kids", label: "Kids" },
      { href: "/college", label: "Global College" },
    ],
  },
  {
    heading: "Grow",
    links: [
      { href: "/daily-word", label: "Daily Word" },
      { href: "/books", label: "Books" },
      { href: "/bible-app", label: "Bible App" },
      { href: "/selah", label: "Selah" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/vision", label: "Vision" },
      { href: "/history", label: "History" },
      { href: "/leaders", label: "Leaders" },
      { href: "/contact", label: "Contact" },
      { href: "/give", label: "Give" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-cream text-ink-900">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-10 lg:px-16">
        {/* Columns */}
        <div className="pb-14">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                prefetch={false}
                className="font-display italic text-ink-900"
                style={{ fontSize: 26, fontWeight: 300 }}
              >
                Futures
              </Link>
              <p className="mt-4 max-w-xs font-sans text-ink-600" style={{ fontSize: 14, lineHeight: 1.6 }}>
                One family across 21 campuses in 4 countries. Since 1922.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://instagram.com/futureschurch"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-ink-600 transition-colors hover:text-warm-500"
                >
                  <Instagram className="h-5 w-5" strokeWidth={1.6} />
                </a>
                <a
                  href="https://youtube.com/futureschurch"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-ink-600 transition-colors hover:text-warm-500"
                >
                  <Youtube className="h-5 w-5" strokeWidth={1.6} />
                </a>
                <a
                  href="https://open.spotify.com/show/futureschurch"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Spotify podcast"
                  className="text-ink-600 transition-colors hover:text-warm-500"
                >
                  <Music2 className="h-5 w-5" strokeWidth={1.6} />
                </a>
                <a
                  href="https://facebook.com/futureschurch"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-ink-600 transition-colors hover:text-warm-500"
                >
                  <Facebook className="h-5 w-5" strokeWidth={1.6} />
                </a>
              </div>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p
                  className="font-ui uppercase text-ink-600"
                  style={{ fontSize: 11, letterSpacing: "0.24em" }}
                >
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="font-sans text-ink-900/85 transition-colors hover:text-warm-500"
                        style={{ fontSize: 14 }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Vision ticker + bottom strip */}
        <div className="mt-10 border-t border-ink-900/10 pt-8">
          <p
            className="font-ui uppercase text-ink-600"
            style={{ fontSize: 10.5, letterSpacing: "0.3em" }}
          >
            {progress.campuses.current} campuses · 4 countries · {progress.leaders.current.toLocaleString()} leaders raised · {progress.souls.current.toLocaleString()} souls · since 1922
          </p>

          <div className="mt-6 flex flex-col gap-3 font-sans text-ink-600 sm:flex-row sm:items-center sm:justify-between" style={{ fontSize: 12 }}>
            <p>© {year} Futures Church. Adelaide, Australia.</p>
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/privacy" className="transition-colors hover:text-warm-500">
                Privacy
              </Link>
              <Link href="/accessibility" className="transition-colors hover:text-warm-500">
                Accessibility
              </Link>
              <Link href="/sitemap.xml" className="transition-colors hover:text-warm-500">
                Sitemap
              </Link>
              <a
                href="mailto:hello@futures.church"
                className="transition-colors hover:text-warm-500"
              >
                hello@futures.church
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
