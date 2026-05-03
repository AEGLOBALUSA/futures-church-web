import type { Metadata } from "next";
import dreamers from "@/content/dreamers.json";
import { DreamersPageClient } from "@/components/streams/DreamersPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "Dreamers",
  description:
    "For the generation that's about to change everything. Friday nights, summer camps, mentors who stay in the room.",
};

export default async function DreamersPage() {
  const slots = await getSlotsForPage("/dreamers");
  return (
    <SlotProvider initialValues={slots}>
      <DreamersPageClient data={dreamers} />
    </SlotProvider>
  );
}
