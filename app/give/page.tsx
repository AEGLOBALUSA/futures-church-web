import type { Metadata } from "next";
import { GivePageClient } from "@/components/action/GivePageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Every dollar has a name on it. Give to Futures Church — tithe, offering, vision, or capital. Secure giving in USD, AUD, or IDR.",
};

export default async function GivePage() {
  const slots = await getSlotsForPage("/give");
  return (
    <SlotProvider initialValues={slots}>
      <GivePageClient />
    </SlotProvider>
  );
}
