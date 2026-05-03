import type { Metadata } from "next";
import { PlanAVisitPageClient } from "@/components/action/PlanAVisitPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "Plan a Visit",
  description:
    "Plan a visit. We’ll save you a seat — and your campus pastor will text you Saturday morning so you know who to look for.",
};

export default async function PlanAVisitPage() {
  const slots = await getSlotsForPage("/plan-a-visit");
  return (
    <SlotProvider initialValues={slots}>
      <PlanAVisitPageClient />
    </SlotProvider>
  );
}
