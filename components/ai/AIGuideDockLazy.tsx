"use client";

import dynamic from "next/dynamic";

// Lazy boundary for the Milo dock. The dock + its dependencies (framer-motion,
// chat panel, response card, input) only get downloaded once the page is
// otherwise interactive. Saves ~30–40 kB of JS off the critical path on every
// route. ssr: false because the dock is purely client (icon + animation).
const AIGuideDockInner = dynamic(
  () => import("./AIGuideDock").then((m) => ({ default: m.AIGuideDock })),
  { ssr: false }
);

export function AIGuideDockLazy() {
  return <AIGuideDockInner />;
}
