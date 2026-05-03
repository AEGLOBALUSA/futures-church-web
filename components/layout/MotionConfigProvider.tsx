"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global framer-motion configuration. `reducedMotion="user"` makes every
 * <motion.*> in the tree honour the visitor's `prefers-reduced-motion`
 * setting without requiring per-component `useReducedMotion()` calls —
 * framer-motion replaces transform/scale animations with cross-fades
 * (or skips them entirely) when the OS-level setting is on.
 *
 * CSS animations are already gated by globals.css; this closes the
 * framer-motion side of the same WCAG 2.1 AA requirement.
 */
export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
