import type { Metadata } from "next";
import timeline from "@/content/history/timeline.json";
import gallery from "@/content/history/gallery.json";
import familyTree from "@/content/history/family-tree.json";
import { HistoryPageClient } from "@/components/story/HistoryPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "History",
  description:
    "A hundred years of saying come home. From one Adelaide chapel in 1922 to twenty-one campuses today.",
};

export default async function HistoryPage() {
  const slots = await getSlotsForPage("/history");
  return (
    <SlotProvider initialValues={slots}>
      <HistoryPageClient data={{ timeline, gallery, familyTree }} />
    </SlotProvider>
  );
}
