import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AIGuideDock } from "@/components/ai-guide/AIGuideDock";

export const metadata: Metadata = {
  title: {
    default: "Futures Church — A Home for Everyone",
    template: "%s | Futures Church",
  },
  description:
    "A home for everyone. Every race. Every age. Every stage. One culture. 21 campuses across 4 countries — Australia, USA, Indonesia — with Venezuela launching next.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church"
  ),
  openGraph: {
    title: "Futures Church — A Home for Everyone",
    description:
      "A home for everyone. Every race. Every age. Every stage. One culture.",
    url: "https://futures.church",
    siteName: "Futures Church",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Futures Church",
    description: "A home for everyone.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050506",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="font-sans bg-obsidian-900 text-bone antialiased min-h-screen">
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
        <AIGuideDock />
      </body>
    </html>
  );
}
