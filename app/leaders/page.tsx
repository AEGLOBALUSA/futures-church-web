import type { Metadata } from "next";
import senior from "@/content/leaders/senior-pastors.json";
import campusPastors from "@/content/leaders/campus-pastors.json";
import executive from "@/content/leaders/executive.json";
import ministryLeads from "@/content/leaders/ministry-leads.json";
import { LeadersPageClient } from "@/components/story/LeadersPageClient";

export const metadata: Metadata = {
  title: "Leaders",
  description:
    "Every pastor. Every campus. Every face. The leaders behind twenty-one Futures churches across four countries.",
};

export default function LeadersPage() {
  return (
    <LeadersPageClient
      data={{ senior, campusPastors, executive, ministryLeads }}
    />
  );
}
