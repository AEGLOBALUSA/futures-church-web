import type { Metadata } from "next";
import women from "@/content/women.json";
import { WomenPageClient } from "@/components/streams/WomenPageClient";

export const metadata: Metadata = {
  title: "bU Women",
  description:
    "A global movement for women who are done living small. Led by Jane Evans.",
};

export default function WomenPage() {
  return <WomenPageClient data={women} />;
}
