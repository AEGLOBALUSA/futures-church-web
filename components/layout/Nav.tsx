"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NearestCampusButton } from "./NearestCampusButton";

type Item =
  | { href: string; label: string; children?: undefined }
  | { label: string; href?: undefined; children: { href: string; label: string }[] };

const NAV_ITEMS: Item[] = [
  { href: "/campuses", label: "Campuses" },
  { href: "/watch", label: "Watch" },
  { href: "/selah", label: "Selah" },
  {
    label: "Family",
    children: [
      { href: "/women", label: "bU Women" },
      { href: "/dreamers", label: "Dreamers" },
      { href: "/kids", label: "Kids" },
      { href: "/college", label: "Global College" },
    ],
  },
  { href: "/daily-word", label: "Daily Word" },
  { href: "/give", label: "Give" },
];

export function Nav() {
  const pathname = usePathname();
  // Pages with a dark <main> (bg-ink-900) need the nav rendered in light text
  // so the wordmark + links don't disappear into the page. Selah uses the
  // dark layout treatment; legal pages do too.
  const DARK_PATHS = ["/selah", "/privacy", "/terms"];
  const isDark =
    !!pathname && DARK_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const dropdownTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function openDropdown(label: string) {
    if (dropdownTimer.current) window.clearTimeout(dropdownTimer.current);
    setDropdown(label);
  }
  function closeDropdown() {
    if (dropdownTimer.current) window.clearTimeout(dropdownTimer.current);
    dropdownTimer.current = window.setTimeout(() => setDropdown(null), 120);
  }

  const baseText = isDark ? "text-cream/80" : "text-ink-600";
  const hoverText = isDark ? "hover:text-cream" : "hover:text-ink-900";
  const wordmarkText = isDark ? "text-cream" : "text-ink-900";

  // Single consistent shell — no transparent-at-top state. Earlier behavior
  // started with bg-transparent which let the page bg show through, producing
  // unreadable nav text on pages where the underlying bg happened to be dark.
  // Keep `scrolled` only to subtly deepen the shadow on scroll; bg stays put.
  const shellClass = isDark
    ? `bg-obsidian-900/85 backdrop-blur-glass border-b border-cream/10 ${scrolled ? "shadow-[0_8px_24px_-16px_rgba(0,0,0,0.5)]" : ""}`
    : `bg-cream/90 backdrop-blur-glass border-b border-ink-900/10 ${scrolled ? "shadow-[0_8px_24px_-16px_rgba(20,20,20,0.15)]" : ""}`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${shellClass}`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          prefetch={false}
          className={`font-display italic tracking-tight ${wordmarkText}`}
          style={{ fontSize: 22, fontWeight: 300 }}
        >
          Futures
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openDropdown(item.label)}
                onMouseLeave={closeDropdown}
              >
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 font-ui text-[14px] transition-colors ${baseText} ${hoverText}`}
                  aria-expanded={dropdown === item.label}
                  aria-haspopup="menu"
                  onFocus={() => openDropdown(item.label)}
                  onBlur={closeDropdown}
                >
                  {item.label}
                </button>
                <AnimatePresence>
                  {dropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 top-full pt-2"
                      role="menu"
                    >
                      <div
                        className={`w-52 rounded-2xl border p-2 shadow-lg backdrop-blur-glass ${
                          isDark
                            ? "border-cream/10 bg-obsidian-900/90"
                            : "border-ink-900/10 bg-cream/95"
                        }`}
                      >
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            role="menuitem"
                            className={`block rounded-xl px-3 py-2 font-ui text-[14px] transition-colors ${baseText} ${hoverText} ${
                              isDark ? "hover:bg-cream/5" : "hover:bg-ink-900/5"
                            }`}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 font-ui text-[14px] transition-colors ${baseText} ${hoverText}`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-2">
          <NearestCampusButton variant={isDark ? "nav-dark" : "nav"} />
          <Link
            href="/plan-a-visit"
            className="inline-flex items-center rounded-full bg-warm-500 px-5 py-2 font-ui text-[14px] text-cream transition-colors hover:bg-warm-700"
          >
            Plan a visit
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-11 w-11 items-center justify-center md:hidden"
        >
          <Menu className={`h-5 w-5 ${isDark ? "text-cream" : "text-ink-900"}`} strokeWidth={1.75} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
            style={{
              background: isDark
                ? "rgba(5,5,6,0.96)"
                : "rgba(253,251,246,0.96)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
            }}
          >
            <div className="flex h-full flex-col px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={`font-display italic ${wordmarkText}`}
                  style={{ fontSize: 22, fontWeight: 300 }}
                >
                  Futures
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center"
                >
                  <X className={`h-5 w-5 ${isDark ? "text-cream" : "text-ink-900"}`} strokeWidth={1.75} />
                </button>
              </div>

              <nav className="mt-10 flex flex-col gap-5">
                {NAV_ITEMS.map((item) =>
                  item.children ? (
                    <div key={item.label}>
                      <p
                        className={`font-ui uppercase ${isDark ? "text-cream/60" : "text-ink-600"}`}
                        style={{ fontSize: 11, letterSpacing: "0.24em" }}
                      >
                        {item.label}
                      </p>
                      <div className="mt-2 flex flex-col gap-3 pl-1">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={() => setOpen(false)}
                            className={`block py-2 font-display italic ${isDark ? "text-cream" : "text-ink-900"}`}
                            style={{ fontSize: 26, fontWeight: 300 }}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block py-2 font-display italic ${isDark ? "text-cream" : "text-ink-900"}`}
                      style={{ fontSize: 28, fontWeight: 300 }}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <div onClick={() => setOpen(false)}>
                  <NearestCampusButton variant="mobile" />
                </div>
                <Link
                  href="/plan-a-visit"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-warm-500 px-6 py-4 font-ui text-[15px] text-cream"
                >
                  Plan a visit →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
