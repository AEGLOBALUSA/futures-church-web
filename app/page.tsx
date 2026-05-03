import { HomeHero } from "@/components/home/HomeHero";
import { HomeMoments } from "@/components/home/HomeMoments";
import { HomePastors } from "@/components/home/HomePastors";
import { HomeCampuses } from "@/components/home/HomeCampuses";
import { HomeFamily } from "@/components/home/HomeFamily";
import { HomeRhythms } from "@/components/home/HomeRhythms";
import { HomeInvitation } from "@/components/home/HomeInvitation";
import { HomeVoices } from "@/components/home/HomeVoices";
import { HomeMosaic } from "@/components/home/HomeMosaic";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export default async function HomePage() {
  const slots = await getSlotsForPage("/");
  return (
    <SlotProvider initialValues={slots}>
      <main className="bg-[#FDFBF6] text-[#1C1A17] selection:bg-[#C8906B] selection:text-[#FDFBF6]">
        <HomeHero />
        <HomeMoments />
        <HomePastors />
        <HomeCampuses />
        <HomeFamily />
        <HomeVoices />
        <HomeMosaic />
        <HomeRhythms />
        <HomeInvitation />
      </main>
    </SlotProvider>
  );
}
