import type { Metadata } from "next";
import teams from "@/content/serve.json";
import { ServePageClient } from "@/components/action/ServePageClient";

export const metadata: Metadata = {
  title: "Serve — Futures Church",
  description:
    "Every person who walks through our doors deserves the best hour of their week. You help make that happen.",
};

export default function ServePage() {
  return <ServePageClient teams={teams} />;
}
