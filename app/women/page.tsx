import type { Metadata } from "next";
import women from "@/content/women.json";
import { WomenPageClient } from "@/components/streams/WomenPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "bU Women",
  description:
    "A global movement for women who are done living small. Led by Jane Evans.",
};

export default async function WomenPage() {
  const slots = await getSlotsForPage("/women");
  return (
    <SlotProvider initialValues={slots}>
      <WomenPageClient data={women} />
    </SlotProvider>
  );
}
