import { HeroSection } from "@/components/sections/HeroSection";
import { VisionStrip } from "@/components/sections/VisionStrip";
import { CampusMarquee } from "@/components/sections/CampusMarquee";
import { SelahCountdown } from "@/components/sections/SelahCountdown";
import { LeadersTeaser } from "@/components/sections/LeadersTeaser";
import { BooksRail } from "@/components/sections/BooksRail";
import { FamilyTeaser } from "@/components/sections/FamilyTeaser";
import { DailyWordCapture } from "@/components/sections/DailyWordCapture";
import { VisitCTA } from "@/components/sections/VisitCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <VisionStrip />
      <CampusMarquee />
      <SelahCountdown />
      <LeadersTeaser />
      <BooksRail />
      <FamilyTeaser />
      <DailyWordCapture />
      <VisitCTA />
    </>
  );
}
