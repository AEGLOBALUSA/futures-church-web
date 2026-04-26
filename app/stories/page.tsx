import type { Metadata } from "next";
import stories from "@/content/stories.json";
import { StoriesPageClient } from "@/components/story/StoriesPageClient";

export const metadata: Metadata = {
  title: "Stories — Futures Church",
  description:
    "Real people. Real change. Baptisms, salvations, marriages restored, addictions broken — across 21 campuses.",
};

export default function StoriesPage() {
  return <StoriesPageClient stories={stories} />;
}
