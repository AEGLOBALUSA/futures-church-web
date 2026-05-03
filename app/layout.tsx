import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CollegeNav } from "@/components/layout/CollegeNav";
import { CollegeFooter } from "@/components/layout/CollegeFooter";
import { AIGuideProvider } from "@/lib/ai/AIGuideContext";
import { AIGuideDockLazy } from "@/components/ai/AIGuideDockLazy";
import { ServiceTimeBanner } from "@/components/layout/ServiceTimeBanner";
import { EditModeProvider } from "@/components/edit/EditModeProvider";
import { EditModePill } from "@/components/edit/EditModePill";
import { getEditorScope } from "@/lib/edit/auth";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Futures Church — One family. 21 campuses. 4 countries.",
    template: "%s | Futures Church",
  },
  description:
    "One family across 21 campuses in Australia, the USA, Indonesia — and South America, launching soon. Ask Milo, our AI guide, where you'll feel at home.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church"
  ),
  openGraph: {
    title: "Futures Church — One family. 21 campuses. 4 countries.",
    description:
      "One family across 21 campuses in Australia, the USA, Indonesia — and South America, launching soon.",
    url: "https://futures.church",
    siteName: "Futures Church",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Futures Church",
    description: "One family across 21 campuses in 4 countries.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: { url: "/apple-icon", type: "image/png", sizes: "180x180" },
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFBF6",
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Futures Church",
  alternateName: "Futures",
  url: "https://futures.church",
  logo: "https://futures.church/opengraph-image",
  foundingDate: "1922",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Adelaide",
    addressRegion: "SA",
    addressCountry: "AU",
  },
  sameAs: [
    "https://instagram.com/futureschurch",
    "https://youtube.com/futureschurch",
    "https://facebook.com/futureschurch",
    "https://open.spotify.com/show/futureschurch",
  ],
  email: "hello@futures.church",
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Futures Church",
  url: "https://futures.church",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://futures.church/campuses?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").toLowerCase();
  const isCollegeDomain = host.endsWith("futuresglobal.college");
  // Detect editor scope on the server so the layout can hand it to the
  // EditModeProvider without a client roundtrip. Failures (e.g. INTAKE_ADMIN_SECRET
  // unset in dev) degrade gracefully to "no editor."
  let editorScope: Awaited<ReturnType<typeof getEditorScope>> = null;
  try {
    editorScope = await getEditorScope();
  } catch {
    editorScope = null;
  }

  // Save-Data header (Chrome/Edge in data-saver mode, plus some CDN normalisation).
  // We expose it as a class on <html> so any component can opt out of heavy
  // animation / auto-play / large hero work via a CSS selector or `:has()`
  // without a context roundtrip.
  const saveData = (h.get("save-data") ?? "").toLowerCase() === "on";

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} ${saveData ? "save-data" : ""}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="min-h-screen bg-cream font-sans text-ink-900 antialiased">
        {/* Skip to main content — first focusable element. Visually hidden until
            keyboard focus brings it forward. Required for WCAG 2.1 AA. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:font-ui focus:text-[12px] focus:uppercase focus:tracking-[0.22em] focus:text-cream"
        >
          Skip to main content
        </a>
        <EditModeProvider scope={editorScope}>
          <AIGuideProvider>
            {isCollegeDomain ? <CollegeNav /> : <Nav />}
            {!isCollegeDomain && <ServiceTimeBanner />}
            <main id="main" className="relative">{children}</main>
            {isCollegeDomain ? <CollegeFooter /> : <Footer />}
            <AIGuideDockLazy />
            <EditModePill />
          </AIGuideProvider>
        </EditModeProvider>
      </body>
    </html>
  );
}
