import type { Metadata } from "next";
import college from "@/content/college.json";
import { CollegePageClient } from "@/components/streams/CollegePageClient";
import { USAccreditationNote } from "@/components/streams/USAccreditationNote";

const COLLEGE_TITLE = "Futures College — Church Planting Leadership · 2026 Intake";
const COLLEGE_DESCRIPTION =
  "Alphacrucis-accredited one-year church-planting leadership school. Outthink. Outbuild. Outlead. September 2026 intake in Adelaide + Atlanta.";

export const metadata: Metadata = {
  title: { absolute: COLLEGE_TITLE },
  description: COLLEGE_DESCRIPTION,
  alternates: {
    canonical: "https://futures.church/college",
  },
  openGraph: {
    title: COLLEGE_TITLE,
    description: COLLEGE_DESCRIPTION,
    url: "https://futures.church/college",
    siteName: "Futures Church",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://futures.church/college/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Futures College — Outthink. Outbuild. Outlead.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: COLLEGE_TITLE,
    description: COLLEGE_DESCRIPTION,
    images: ["https://futures.church/college/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function CollegePage() {
  return (
    <CollegePageClient
      data={college}
      usAccreditationSlot={<USAccreditationNote />}
    />
  );
}
