import type { Metadata } from "next";
import kids from "@/content/kids.json";
import { KidsPageClient } from "@/components/streams/KidsPageClient";

export const metadata: Metadata = {
  title: "Kids",
  description:
    "Sundays your kids will ask to come back to. Safe, biblical, and genuinely great — at every Futures campus, every week.",
};

export default function KidsPage() {
  return <KidsPageClient data={kids} />;
}
