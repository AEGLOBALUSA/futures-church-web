import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility — Futures Church",
  description:
    "Futures Church is committed to digital accessibility for everyone. How to report an issue and what we're doing about it.",
  alternates: { canonical: "https://futures.church/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      subtitle="We want everyone to be able to use this site. If something gets in your way, tell us."
      updated="Last updated 26 April 2026"
      sections={[
        {
          h: "Our commitment",
          body: [
            "Futures Church is committed to ensuring digital accessibility for people with disabilities. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA across futures.church, futuresglobal.college, and our other digital properties.",
            "We actively work to increase the accessibility and usability of our website and apply the relevant accessibility standards as we build and update pages.",
          ],
        },
        {
          h: "What we've done",
          body: [
            "Semantic HTML throughout — headings, landmarks, and lists used correctly so screen readers can navigate the page structure.",
            "Sufficient colour contrast on all text against its background, tested to WCAG 2.1 AA ratios.",
            "All interactive elements are keyboard-reachable and have visible focus indicators.",
            "Images, icons, and non-text content carry descriptive alt text or aria-labels.",
            "Forms include visible labels and clear error messages.",
            "Video content on /watch includes captions where available.",
          ],
        },
        {
          h: "Known limitations",
          body: [
            "Some older embedded content (third-party video players, map embeds) may not fully meet AA standards — we're working through these.",
            "Our guide (Milo) is a conversational interface. If the chat widget is inaccessible for you, you can reach a human directly at hello@futures.church.",
          ],
        },
        {
          h: "How to report an issue",
          body: [
            "If you encounter an accessibility barrier on any of our pages, please email accessibility@futures.church. Include the page URL, what you were trying to do, and what assistive technology you were using (if any).",
            "We aim to acknowledge reports within two business days and resolve confirmed issues within 30 days.",
          ],
        },
        {
          h: "Third-party content",
          body: [
            "Some pages embed third-party services (YouTube, Spotify, Google Maps, Stripe). We cannot guarantee the accessibility of those services, but we link to their own accessibility statements where available.",
          ],
        },
        {
          h: "Formal complaints",
          body: [
            "If you're not satisfied with our response, you can contact the relevant authority in your country — for example, the Australian Human Rights Commission (humanrights.gov.au) or the US Access Board (access-board.gov).",
          ],
        },
      ]}
    />
  );
}
