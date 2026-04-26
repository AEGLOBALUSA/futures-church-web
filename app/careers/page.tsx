import type { Metadata } from "next";
import roles from "@/content/careers.json";
import { CareersPageClient } from "@/components/action/CareersPageClient";

export const metadata: Metadata = {
  title: "Careers — Futures Church",
  description:
    "Open roles across 21 campuses in Australia, USA, Indonesia and beyond. Build something that lasts.",
};

export default function CareersPage() {
  return <CareersPageClient roles={roles} />;
}
