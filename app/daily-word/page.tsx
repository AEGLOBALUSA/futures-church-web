import type { Metadata } from "next";
import dailyWord from "@/content/daily-word.json";
import { DailyWordPageClient } from "@/components/streams/DailyWordPageClient";

export const metadata: Metadata = {
  title: "Daily Word",
  description:
    "One scripture. One reflection. One question to carry — delivered at 5am your time.",
};

export default function DailyWordPage() {
  return <DailyWordPageClient data={dailyWord} />;
}
