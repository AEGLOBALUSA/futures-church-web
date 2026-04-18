import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

const footerLinks = [
  {
    heading: "Church",
    links: [
      { href: "/about", label: "About" },
      { href: "/vision", label: "Vision" },
      { href: "/history", label: "History" },
      { href: "/leaders", label: "Leaders" },
      { href: "/campuses", label: "Campuses" },
    ],
  },
  {
    heading: "Family",
    links: [
      { href: "/women", label: "bU Women" },
      { href: "/dreamers", label: "Dreamers" },
      { href: "/kids", label: "Kids" },
      { href: "/college", label: "Global College" },
      { href: "/selah", label: "Selah App" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/watch", label: "Watch" },
      { href: "/daily-word", label: "Daily Word" },
      { href: "/bible-app", label: "Bible App" },
      { href: "/books", label: "Books" },
      { href: "/give", label: "Give" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { href: "/plan-a-visit", label: "Plan a Visit" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-obsidian-900 border-t border-bone/10 pt-20 pb-10 relative overflow-hidden">
      <div className="mx-auto max-w-shell px-6 sm:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" prefetch={false} className="block mb-4">
              <span className="font-display text-2xl text-bone" style={{ fontWeight: 300 }}>
                Futures<span className="text-lemon">.</span>
              </span>
            </Link>
            <p className="text-sm text-bone/70 font-sans leading-relaxed max-w-xs">
              A home for everyone. Every race. Every age. Every stage. One culture.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com/futureschurch" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-bone/50 hover:text-lemon transition-colors" strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com/futureschurch" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-5 h-5 text-bone/50 hover:text-lemon transition-colors" strokeWidth={1.5} />
              </a>
              <a href="https://youtube.com/futureschurch" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="w-5 h-5 text-bone/50 hover:text-lemon transition-colors" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p className="section-label text-bone/50 mb-4">{col.heading.toUpperCase()}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-bone/75 hover:text-bone transition-colors font-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-bone/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-bone/50 font-sans">
          <p>© {new Date().getFullYear()} Futures Church. All rights reserved.</p>
          <p>
            Founded 1922 · Adelaide, Australia ·{" "}
            <a href="mailto:hello@futures.church" className="hover:text-lemon transition-colors">
              hello@futures.church
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
