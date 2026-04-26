import type { Metadata } from "next";
import groups from "@/content/groups.json";
import { GroupsPageClient } from "@/components/action/GroupsPageClient";

export const metadata: Metadata = {
  title: "Life Groups — Futures Church",
  description:
    "Find a life group near you. Sunday is the start — community is the whole thing.",
};

export default function GroupsPage() {
  return <GroupsPageClient groups={groups} />;
}
