"use client";

import { useEffect } from "react";
import { AIInput } from "@/components/ai/AIInput";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type Props = {
  campusName: string;
  city: string;
  leadPastors?: string;
  isLaunching: boolean;
  isOnline: boolean;
  brand: "futures" | "futuros";
  spanish?: boolean;
};

export function CampusAIPanel({
  campusName,
  city,
  leadPastors,
  isLaunching,
  isOnline,
  brand,
  spanish,
}: Props) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("campus-detail"), [setPageContext]);

  const chips: string[] = [];
  if (isLaunching) {
    chips.push(`when does ${campusName} launch?`);
    chips.push("can I help launch this campus?");
  } else if (isOnline) {
    chips.push("when do you stream live?");
    chips.push("how do I join online community?");
  } else {
    chips.push(`what time are Sunday services at ${campusName}?`);
    chips.push(`what's kids ministry like at ${campusName}?`);
    if (leadPastors) chips.push(`tell me about ${leadPastors}`);
    chips.push(`I'd like to plan a visit to ${campusName}`);
  }
  if (spanish || brand === "futuros") chips.push("¿hay servicios en español?");
  chips.push(`how do I serve at ${campusName}?`);

  return (
    <section className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <p
          className="font-sans"
          style={{
            color: "#534D44",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Ask Ezra about {city}
        </p>
        <h2
          className="mt-3 font-display"
          style={{
            color: "#1C1A17",
            fontSize: "clamp(1.6rem, 2.8vw, 2.25rem)",
            lineHeight: 1.1,
            fontWeight: 300,
          }}
        >
          A pastor&rsquo;s a message away.
        </h2>
        <div className="mt-6">
          <AIInput
            placeholder={`ask about ${campusName}…`}
            chips={chips}
            compact
          />
        </div>
      </div>
    </section>
  );
}
