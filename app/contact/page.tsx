import type { Metadata } from "next";
import { ContactPageClient } from "@/components/action/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what\u2019s on your heart. A human replies to every note \u2014 pastoral care, campus, press, partnerships, finance, prayer.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
