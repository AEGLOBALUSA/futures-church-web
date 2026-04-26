import type { Metadata } from "next";
import events from "@/content/events.json";
import { EventsPageClient } from "@/components/action/EventsPageClient";

export const metadata: Metadata = {
  title: "Events — Futures Church",
  description:
    "Upcoming services, gatherings, baptism Sundays, camps, conferences, and more across all Futures campuses.",
};

export default function EventsPage() {
  return <EventsPageClient events={events} />;
}
