import type { Metadata } from "next";
import progress from "@/content/vision/progress.json";
import { VisionPageClient } from "@/components/story/VisionPageClient";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "Two hundred campuses. Ten thousand leaders. Two hundred thousand souls. A hundred-year family with a ten-year mission.",
};

export default function VisionPage() {
  return <VisionPageClient data={progress} />;
}
