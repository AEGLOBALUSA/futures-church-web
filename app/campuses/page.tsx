import type { Metadata } from "next";
import { Suspense } from "react";
import { CampusesHero } from "./CampusesHero";
import { MomentsReel } from "./MomentsReel";
import { PeopleGallery } from "./PeopleGallery";
import { CampusesMap } from "./CampusesMap";
import { Invitation } from "./Invitation";

export const metadata: Metadata = {
  title: "Campuses · Futures Church",
  description:
    "Twenty-one campuses across four countries — with four more launching in Venezuela. One family. Find your home.",
  openGraph: {
    title: "Find your home · Futures Church",
    description: "Twenty-one campuses across four countries. Venezuela coming soon.",
    images: ["/og-campuses.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find your home · Futures Church",
    description: "Twenty-one campuses across four countries. Venezuela coming soon.",
    images: ["/og-campuses.png"],
  },
};

export default function CampusesPage() {
  return (
    <main className="bg-[#FDFBF6] text-[#1C1A17] selection:bg-[#C8906B] selection:text-[#FDFBF6]">
      <Suspense fallback={<div className="min-h-screen" />}>
        <CampusesHero />
      </Suspense>
      <MomentsReel />
      <PeopleGallery />
      <CampusesMap />
      <Invitation />
    </main>
  );
}
