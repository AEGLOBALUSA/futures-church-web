import type { Metadata } from "next";
import faq from "@/content/selah/faq.json";
import { SelahPageClient } from "@/components/streams/SelahPageClient";

export const metadata: Metadata = {
  title: "Selah — A daily pastoral companion",
  description:
    "For the questions you can't google. A pastor who has memorised the whole Bible, sat under the church's most trusted teachers, and trained in theology, philosophy, psychology, and psychiatry — all under a biblical worldview. The pastoral care that used to take a lifetime to find. Launching May 15, 2026.",
};

export default function SelahPage() {
  return <SelahPageClient data={{ faq }} />;
}
