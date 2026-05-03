import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import {
  listAllCampusesWithProgress,
  getRecentActivity,
} from "@/lib/intake/server";
import { intakeSections } from "@/lib/intake/sections";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  if (!(await isAdminAuthed())) redirect("/intake/admin/login");

  const [campuses, activity] = await Promise.all([
    listAllCampusesWithProgress(),
    getRecentActivity(40),
  ]);

  // Pull all responses + photos in two queries so the grid can render per-section status.
  const supabase = createSupabaseServiceClient();
  const [resp, photos] = await Promise.all([
    supabase
      .from("intake_response")
      .select("campus_slug, section_key, field_key, value")
      .then((r) => r.data ?? []),
    supabase
      .from("intake_photo")
      .select("campus_slug, section_key")
      .then((r) => r.data ?? []),
  ]);

  return (
    <AdminDashboard
      campuses={campuses}
      sections={intakeSections}
      responses={resp}
      photos={photos}
      activity={activity}
    />
  );
}

export const metadata = {
  title: "Campus intake — admin",
  robots: { index: false, follow: false },
};
