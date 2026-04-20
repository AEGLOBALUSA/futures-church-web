import type { Metadata } from "next";
import { GivePageClient } from "@/components/action/GivePageClient";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Every dollar has a name on it. Give to Futures Church \u2014 tithe, offering, vision, or capital. Secure giving in USD, AUD, or IDR.",
};

export default function GivePage() {
  return <GivePageClient />;
}
