import type { Metadata } from "next";
import about from "@/content/about.json";
import { AboutPageClient } from "@/components/story/AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "A home for everyone. Twenty-one campuses across four countries, one family under Ashley & Jane Evans.",
};

export default function AboutPage() {
  return <AboutPageClient data={about} />;
}
