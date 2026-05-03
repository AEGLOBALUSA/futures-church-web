import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy — Futures Church",
  description:
    "How Futures Church and Selah handle your data. Zero-retention on conversations. Plain English.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      subtitle="Plain English. Short on purpose."
      updated="Effective 19 April 2026"
      sections={[
        {
          h: "What we collect",
          body: [
            "Newsletter and founding-member signups: your email address, first name (if you give it), and whatever you write in the optional \u201cone thing on your heart\u201d field. That\u2019s it.",
            "Analytics: anonymous page views and session duration buckets. No identifiers, no fingerprinting, no cross-site tracking.",
            "Cookies: the strictly necessary kind only. We do not set advertising or tracking cookies.",
          ],
        },
        {
          h: "Selah conversations \u2014 our covenant",
          body: [
            "When you talk to Selah, your messages are not stored, not logged, and not read by anyone. No moderator inbox. No pastor alert. No staff review.",
            "Your conversation exists only in your browser for the length of that session. Close the tab and it\u2019s gone.",
            "What we do track \u2014 at the aggregate level only \u2014 is how many conversations happened, how long they lasted, what type of pastoral mode the conversation drew on, and whether the crisis classifier fired. Never the content of what you said.",
            "If the crisis classifier fires (for example, language suggesting self-harm), Selah surfaces real-world help \u2014 988 in the US, Lifeline 13 11 14 in Australia, Samaritans 116 123 in the UK, or your local emergency number. We do not notify a human on your behalf.",
          ],
        },
        {
          h: "Payments",
          body: [
            "Payments for Selah membership are processed by Stripe. We never see or store your full card number \u2014 only the last four digits that Stripe returns to us for your receipt.",
            "Stripe\u2019s own privacy policy covers how they handle payment data.",
          ],
        },
        {
          h: "What we don\u2019t do",
          body: [
            "We don\u2019t sell your data. To anyone. Ever.",
            "We don\u2019t share your email list with partners, sponsors, or other churches.",
            "We don\u2019t use your Selah conversations to train AI models \u2014 ours or anyone else\u2019s.",
            "We don\u2019t fingerprint your device or track you across other sites.",
          ],
        },
        {
          h: "Your rights",
          body: [
            "You can unsubscribe from any email we send at any time. One click, at the bottom of every message.",
            "You can email hello@futures.church and ask us to delete everything we have about you. We\u2019ll do it within seven days and confirm in writing.",
            "If you\u2019re in the EU, UK, or similar jurisdiction, you have GDPR-equivalent rights of access, rectification, and erasure. Same email address \u2014 we honour those requests without argument.",
          ],
        },
        {
          h: "Security",
          body: [
            "Data in transit is always encrypted (HTTPS/TLS 1.3).",
            "Data at rest (email addresses on our signup list, for example) is encrypted and access-controlled.",
            "If we ever have a breach that affects you, we\u2019ll tell you within 72 hours of discovering it.",
          ],
        },
        {
          h: "Kids",
          body: [
            "Selah isn\u2019t designed for anyone under 16. We don\u2019t knowingly collect information from children. If you believe a child has given us information, email us and we\u2019ll delete it.",
          ],
        },
        {
          h: "Changes to this policy",
          body: [
            "If we materially change how we handle your data, we\u2019ll email everyone on our list before the change takes effect and post an updated date at the top of this page. We won\u2019t bury it.",
          ],
        },
        {
          h: "Contact",
          body: [
            "Email hello@futures.church. A real person reads that inbox. We aim to reply within two business days.",
          ],
        },
      ]}
    />
  );
}
