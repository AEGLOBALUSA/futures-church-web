import type { Metadata } from "next";
import sermons from "@/content/sermons.json";
import { WatchPageClient } from "@/components/streams/WatchPageClient";

export const metadata: Metadata = {
  title: "Watch",
  description:
    "Press play. We'll meet you here. Sunday services, weekday teaching, and sermons that found someone in a Tuesday 2am.",
};

export default function WatchPage() {
  return <WatchPageClient data={sermons} />;
}
