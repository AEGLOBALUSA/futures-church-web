import type { Metadata } from "next";
import { Suspense } from "react";
import { CampusesHero } from "./CampusesHero";
import { CountryPortals } from "./CountryPortals";
import { AllCampusesGallery } from "./AllCampusesGallery";
import { Invitation } from "./Invitation";

export const metadata: Metadata = {
  title: "Campuses · Futures Church",
  description:
    "Twenty-five campuses across five nations — United States, Australia, Indonesia, Venezuela, and Brazil. Step through a country portal and meet the family.",
  openGraph: {
    title: "Find your home · Futures Church",
    description: "Five nations. Twenty-five campuses. Step through a country portal and meet the family.",
    images: ["/og-campuses.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find your home · Futures Church",
    description: "Five nations. Twenty-five campuses.",
    images: ["/og-campuses.png"],
  },
};

export default function CampusesPage() {
  return (
    <main className="bg-[#FDFBF6] text-[#1C1A17] selection:bg-[#C8906B] selection:text-[#FDFBF6]">
      <Suspense fallback={<div className="min-h-screen" />}>
        <CampusesHero />
      </Suspense>
      <CountryPortals />
      <AllCampusesGallery />
      <Invitation />
    </main>
  );
}
