import type { Metadata } from "next";
import { PlanAVisitPageClient } from "@/components/action/PlanAVisitPageClient";

export const metadata: Metadata = {
  title: "Plan a Visit",
  description:
    "Plan a visit. We\u2019ll save you a seat \u2014 and your campus pastor will text you Saturday morning so you know who to look for.",
};

export default function PlanAVisitPage() {
  return <PlanAVisitPageClient />;
}
