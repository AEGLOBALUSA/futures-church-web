import type { Metadata } from "next";
import { PrayerPageClient } from "@/components/action/PrayerPageClient";

export const metadata: Metadata = {
  title: "Prayer — Futures Church",
  description:
    "Submit a prayer request. Our pastors pray over every request personally. Same-day response.",
};

export default function PrayerPage() {
  return <PrayerPageClient />;
}
