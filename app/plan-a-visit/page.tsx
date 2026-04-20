import type { Metadata } from "next";
import { PlanAVisitPageClient } from "@/components/action/PlanAVisitPageClient";

export const metadata: Metadata = {
  title: "Plan a Visit",
  description:
    "Come visit. We\u2019ve been expecting you. Tell us a few things and we\u2019ll save you a seat \u2014 and meet you at the door.",
};

export default function PlanAVisitPage() {
  return <PlanAVisitPageClient />;
}
