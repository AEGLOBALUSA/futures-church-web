"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { AIInput } from "./AIInput";
import { ResponseCard } from "./ResponseCard";

export function AIGuideDock() {
  const {
    isOpen,
    openDock,
    closeDock,
    messages,
    unreadCount,
    isStreaming,
    requestLocationAndResend,
  } = useAIGuide();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const isDark = pathname?.startsWith("/selah") ?? false;
  // Hide the dock on the homepage — the hero contains its own Milo surface.
  // CRITICAL: this flag is consumed at the END of the component (after every
  // hook has already been called). Returning early BEFORE useEffect() causes
  // React error #310 ("rendered more hooks than during the previous render")
  // when the visitor navigates from "/" to a page where the dock should show.
  const hideDock = pathname === "/";

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const launcherClass = isDark
    ? "border-cream/15 bg-umber-900/70 text-cream"
    : "border-glass-border bg-glass-bg text-ink-900";
  const dockClass = isDark
    ? "border-cream/10 bg-umber-900/85 text-cream shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)]"
    : "border-glass-border bg-glass-bg text-ink-900 shadow-[0_40px_80px_-30px_rgba(20,20,20,0.5)]";
  const headerBorder = isDark ? "border-cream/10" : "border-ink-900/5";
  const headerTitleColor = isDark ? "text-cream" : "text-ink-900";
  const headerSubColor = isDark ? "text-cream/60" : "text-ink-600";
  const closeBtn = isDark
    ? "text-cream/70 hover:bg-cream/5"
    : "text-ink-600 hover:bg-ink-900/5";
  const avatarBg = isDark ? "bg-cream text-ink-900" : "bg-ink-900 text-cream";
  const emptyText = isDark ? "text-cream/60" : "text-ink-600";
  const dotsColor = isDark ? "bg-cream/70" : "bg-ink-600";

  // Render nothing on the homepage. Safe to early-return here because every
  // hook above has already been called this render (and was last render too).
  if (hideDock) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="launcher"
            type="button"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={openDock}
            aria-label={
              unreadCount > 0
                ? `Ask Milo (${unreadCount} new message${unreadCount === 1 ? "" : "s"})`
                : "Ask Milo"
            }
            className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-50 flex items-center gap-3 rounded-full border px-5 py-3 font-ui shadow-[0_20px_48px_-24px_rgba(20,20,20,0.35)] backdrop-blur-glass transition-transform hover:-translate-y-0.5 ${launcherClass}`}
            style={{
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              backdropFilter: "blur(24px) saturate(180%)",
              animation:
                unreadCount > 0
                  ? "inputBreathe 2s ease-in-out infinite"
                  : undefined,
            }}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${avatarBg}`}
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.6} />
            </span>
            <span className="text-sm">Ask Milo</span>
            {unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-warm-500 px-2 py-0.5 text-xs text-cream">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="dock"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            role="dialog"
            aria-label="Milo — Futures guide"
            className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-50 flex w-[min(460px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border backdrop-blur-glass ${dockClass}`}
            style={{
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              backdropFilter: "blur(24px) saturate(180%)",
              maxHeight: "min(720px, calc(100dvh - 2rem))",
            }}
          >
            <header className={`flex items-center justify-between border-b px-5 py-4 ${headerBorder}`}>
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${avatarBg}`}
                >
                  <Sparkles className="h-4 w-4" strokeWidth={1.6} />
                </span>
                <div>
                  <p
                    className={`font-display italic ${headerTitleColor}`}
                    style={{ fontSize: 17, fontWeight: 300 }}
                  >
                    Milo
                  </p>
                  <p className={`font-ui ${headerSubColor}`} style={{ fontSize: 11 }}>
                    {isStreaming ? "typing…" : "here when you need"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDock}
                aria-label="Close Milo"
                className={`flex h-11 w-11 items-center justify-center rounded-full transition ${closeBtn}`}
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
              style={{ minHeight: 220 }}
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-8">
                  <p
                    className={`max-w-[28ch] text-center font-display italic ${emptyText}`}
                    style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.4 }}
                  >
                    I&rsquo;m Milo. Ask me anything — I&rsquo;ll take it seriously.
                  </p>
                </div>
              ) : (
                messages.map((m) => (
                  <ResponseCard
                    key={m.id}
                    message={m}
                    onShareLocation={requestLocationAndResend}
                  />
                ))
              )}
              {isStreaming && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-1 self-start pl-2">
                  <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${dotsColor}`} />
                  <span
                    className={`h-1.5 w-1.5 animate-pulse rounded-full ${dotsColor}`}
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className={`h-1.5 w-1.5 animate-pulse rounded-full ${dotsColor}`}
                    style={{ animationDelay: "240ms" }}
                  />
                </div>
              )}
            </div>

            <div className={`border-t px-4 py-4 ${headerBorder}`}>
              <AIInput compact placeholder="Type here…" />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
