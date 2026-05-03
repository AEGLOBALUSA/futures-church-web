import type { Metadata } from "next";
import kids from "@/content/kids.json";
import { KidsPageClient } from "@/components/streams/KidsPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "Kids",
  description:
    "Sundays your kids will ask to come back to. Safe, biblical, and genuinely great — at every Futures campus, every week.",
};

export default async function KidsPage() {
  const slots = await getSlotsForPage("/kids");
  return (
    <SlotProvider initialValues={slots}>
      <KidsPageClient data={kids} />
    </SlotProvider>
  );
}
