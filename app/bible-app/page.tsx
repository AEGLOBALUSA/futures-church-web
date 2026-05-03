import type { Metadata } from "next";
import { BibleAppPageClient } from "@/components/action/BibleAppPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "Bible App",
  description:
    "Futures Bible — Read. Listen. Pause. A Bible app with Selah’s stillness baked in. Free on iOS and Android.",
};

export default async function BibleAppPage() {
  const slots = await getSlotsForPage("/bible-app");
  return (
    <SlotProvider initialValues={slots}>
      <BibleAppPageClient />
    </SlotProvider>
  );
}
