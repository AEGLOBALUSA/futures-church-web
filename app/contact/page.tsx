import type { Metadata } from "next";
import { ContactPageClient } from "@/components/action/ContactPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what’s on your heart. A human replies to every note — pastoral care, campus, press, partnerships, finance, prayer.",
};

export default async function ContactPage() {
  const slots = await getSlotsForPage("/contact");
  return (
    <SlotProvider initialValues={slots}>
      <ContactPageClient />
    </SlotProvider>
  );
}
