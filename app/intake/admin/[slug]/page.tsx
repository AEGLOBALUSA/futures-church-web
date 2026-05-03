import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import {
  getCampusBySlug,
  getResponses,
  getPhotos,
  getComments,
  getSignedPhotoUrl,
} from "@/lib/intake/server";
import { intakeSections } from "@/lib/intake/sections";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { CampusDetailClient } from "./CampusDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CampusDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdminAuthed())) redirect("/intake/admin/login");
  const { slug } = await params;
  const campus = await getCampusBySlug(slug);
  if (!campus) notFound();

  const [responses, photos, comments] = await Promise.all([
    getResponses(slug),
    getPhotos(slug),
    getComments(slug),
  ]);

  const supabase = createSupabaseServiceClient();
  const { data: activity } = await supabase
    .from("intake_activity")
    .select("*")
    .eq("campus_slug", slug)
    .order("created_at", { ascending: false })
    .limit(30);

  // Sign photo URLs in parallel.
  const photosWithUrls = await Promise.all(
    photos.map(async (p) => ({
      ...p,
      signedUrl: await getSignedPhotoUrl(p.storage_path, 3600),
    }))
  );

  // Build per-section maps.
  const responseBySection: Record<string, Record<string, unknown>> = {};
  const editorBySection: Record<string, { name: string | null; at: string }> = {};
  for (const r of responses) {
    if (!responseBySection[r.section_key]) responseBySection[r.section_key] = {};
    responseBySection[r.section_key][r.field_key] = r.value;
    editorBySection[`${r.section_key}:${r.field_key}`] = {
      name: r.last_edited_by,
      at: r.last_edited_at,
    };
  }
  const photosBySection: Record<string, typeof photosWithUrls> = {};
  for (const p of photosWithUrls) {
    if (!photosBySection[p.section_key]) photosBySection[p.section_key] = [];
    photosBySection[p.section_key].push(p);
  }
  const commentsBySection: Record<string, typeof comments> = {};
  for (const c of comments) {
    if (!commentsBySection[c.section_key]) commentsBySection[c.section_key] = [];
    commentsBySection[c.section_key].push(c);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";
  const accessLink = `${baseUrl}/intake/${slug}?key=${campus.access_token}`;

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-shell items-center gap-4 px-5 py-3 sm:px-8">
          <Link href="/intake/admin" className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900">
            ← All campuses
          </Link>
          <span className="ml-auto font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            {campus.display_name}
          </span>
        </div>
      </header>

      <CampusDetailClient
        campus={campus}
        sections={intakeSections}
        responseBySection={responseBySection}
        editorBySection={editorBySection}
        photosBySection={photosBySection}
        commentsBySection={commentsBySection}
        activity={activity ?? []}
        accessLink={accessLink}
      />
    </div>
  );
}

export const metadata = {
  title: "Campus detail",
  robots: { index: false, follow: false },
};
