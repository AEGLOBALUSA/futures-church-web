"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks: (
  | { href: string; label: string; children?: undefined }
  | { label: string; href?: undefined; children: { href: string; label: string }[] }
)[] = [
  { href: "/about", label: "About" },
  { href: "/campuses", label: "Campuses" },
  { href: "/watch", label: "Watch" },
  {
    label: "Family",
    children: [
      { href: "/women", label: "bU Women" },
      { href: "/dreamers", label: "Dreamers" },
      { href: "/kids", label: "Kids" },
      { href: "/college", label: "Global College" },
    ],
  },
  { href: "/selah", label: "Selah" },
  { href: "/give", label: "Give" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-obsidian-900/70 border-b border-bone/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl text-bone tracking-tight" style={{ fontWeight: 300 }}>
              Futures<span className="text-lemon">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button className="px-4 py-2 text-body-sm text-bone/75 hover:text-bone transition-colors font-sans rounded-full hover:bg-bone/5">
                    {link.label}
                  </button>
                  {dropdown === link.label && (
                    <div className="absolute top-full left-0 pt-1 w-48">
                      <div className="bg-obsidian-800/95 backdrop-blur-xl rounded-2xl border border-bone/10 shadow-2xl py-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-body-sm text-bone/75 hover:text-lemon hover:bg-bone/5 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-body-sm text-bone/75 hover:text-bone transition-colors font-sans rounded-full hover:bg-bone/5"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/plan-a-visit">
              <Button variant="lemon" size="sm">
                Plan a visit →
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-bone p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-obsidian-900/95 backdrop-blur-xl border-t border-bone/10 pb-6">
          <nav className="mx-auto max-w-shell px-6 pt-4 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-4 py-2 section-label text-lemon">{link.label.toUpperCase()}</p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="block px-8 py-2 text-body-sm text-bone/75 hover:text-bone"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-body-sm text-bone/75 hover:text-bone"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-4 px-4">
              <Link href="/plan-a-visit" onClick={() => setOpen(false)}>
                <Button variant="lemon" className="w-full justify-center">
                  Plan a visit
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
