import type { Metadata } from "next";
import resources from "@/content/resources.json";
import { ResourcesPageClient } from "@/components/action/ResourcesPageClient";

export const metadata: Metadata = {
  title: "Resources — Futures Church",
  description:
    "Free downloads — sermon notes, reading plans, devotionals, study guides, and parent guides.",
};

export default function ResourcesPage() {
  return <ResourcesPageClient resources={resources} />;
}
