"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/college#streams", label: "Streams" },
  { href: "/college#programme", label: "Programme" },
  { href: "/college#faculty", label: "Faculty" },
  { href: "/college#free-sessions", label: "Free sessions" },
  { href: "/college#apply-form", label: "Apply →" },
];

export function CollegeNav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ background: "rgba(20,18,15,0.92)", backdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 sm:px-10">
        {/* Logo */}
        <Link href="/college" className="font-display text-cream" style={{ fontSize: 18, fontWeight: 300, letterSpacing: "-0.01em" }}>
          Futures <em className="italic" style={{ color: "#C89A3C" }}>College</em>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-ui text-[12px] uppercase tracking-[0.18em] text-cream/70 transition-colors hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-cream/70"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-ui text-[12px] uppercase tracking-[0.18em] text-cream/70"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
