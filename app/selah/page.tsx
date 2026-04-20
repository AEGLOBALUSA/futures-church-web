import type { Metadata } from "next";
import faq from "@/content/selah/faq.json";
import { SelahPageClient } from "@/components/streams/SelahPageClient";

export const metadata: Metadata = {
  title: "Selah — Three voices. Scripture first.",
  description:
    "A pastoral companion for your hardest questions. Three voices — Prophet, Pastor, Strategist. Scripture first, grounded in the church's most trusted teachers. Launching May 15, 2026.",
};

export default function SelahPage() {
  return <SelahPageClient data={{ faq }} />;
}
