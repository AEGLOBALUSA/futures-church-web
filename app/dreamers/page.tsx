import type { Metadata } from "next";
import dreamers from "@/content/dreamers.json";
import { DreamersPageClient } from "@/components/streams/DreamersPageClient";

export const metadata: Metadata = {
  title: "Dreamers",
  description:
    "For the generation that's about to change everything. Friday nights, summer camps, mentors who stay in the room.",
};

export default function DreamersPage() {
  return <DreamersPageClient data={dreamers} />;
}
