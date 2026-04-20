import type { Metadata } from "next";
import college from "@/content/college.json";
import { CollegePageClient } from "@/components/streams/CollegePageClient";

export const metadata: Metadata = {
  title: "Global College",
  description:
    "One year. Three tracks. Trained on a real campus for real ministry, business, and creative work.",
};

export default function CollegePage() {
  return <CollegePageClient data={college} />;
}
