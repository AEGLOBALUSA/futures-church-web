import type { Metadata } from "next";
import progress from "@/content/vision/progress.json";
import { VisionPageClient } from "@/components/story/VisionPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "Two hundred campuses. Ten thousand leaders. Two hundred thousand souls. A hundred-year family with a ten-year mission.",
};

export default async function VisionPage() {
  const slots = await getSlotsForPage("/vision");
  return (
    <SlotProvider initialValues={slots}>
      <VisionPageClient data={progress} />
    </SlotProvider>
  );
}
