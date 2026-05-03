import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCampusBySlug,
  getResponses,
  getComments,
} from "@/lib/intake/server";
import { listRepositoryPhotos } from "@/lib/intake/photo-repository";
import { intakeSections } from "@/lib/intake/sections";
import { MintCampusEditCookie } from "@/components/edit/MintCampusEditCookie";
import { IntakeClient } from "./IntakeClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = { key?: string };

function NoAccess({ reason }: { reason: string }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-6 py-24">
      <div className="max-w-prose text-center">
        <h1 className="font-display text-display-md text-ink-900">
          This link doesn&rsquo;t look right.
        </h1>
        <p className="mt-6 font-sans text-body text-ink-600">{reason}</p>
        <p className="mt-6 font-sans text-body-sm text-ink-500">
          Email{" "}
          <a className="text-accent underline underline-offset-4" href="mailto:hello@futures.church">
            hello@futures.church
          </a>{" "}
          and we&rsquo;ll send a fresh one.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream/60 px-5 py-2.5 font-ui text-body-sm text-ink-900 transition hover:bg-cream-300"
        >
          ← Back to futures.church
        </Link>
      </div>
    </div>
  );
}

export default async function IntakePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;

  const campus = await getCampusBySlug(slug);
  if (!campus) notFound();

  if (!key || key !== campus.access_token) {
    return (
      <NoAccess reason="The token in your link doesn't match what we have on file. Links are unique to each campus." />
    );
  }

  // Cookie minting happens client-side via <MintCampusEditCookie /> below —
  // Next.js 15 forbids cookies().set() in server components.

  const [responses, repositoryPhotos, comments] = await Promise.all([
    getResponses(slug),
    listRepositoryPhotos(slug),
    getComments(slug),
  ]);

  const responseMap: Record<string, Record<string, unknown>> = {};
  const editorMap: Record<string, { name: string | null; at: string }> = {};
  for (const r of responses) {
    if (!responseMap[r.section_key]) responseMap[r.section_key] = {};
    responseMap[r.section_key][r.field_key] = r.value;
    editorMap[`${r.section_key}:${r.field_key}`] = {
      name: r.last_edited_by,
      at: r.last_edited_at,
    };
  }

  const commentsBySection: Record<string, typeof comments> = {};
  for (const c of comments) {
    if (!commentsBySection[c.section_key]) commentsBySection[c.section_key] = [];
    commentsBySection[c.section_key].push(c);
  }

  const tiles = repositoryPhotos.map((p) => ({
    id: p.id,
    signedUrl: p.signedUrl,
    file_name: p.file_name,
    caption: p.caption,
    category: p.category,
    notes: p.notes,
    isAssigned: p.isAssigned,
    assignedSectionKeys: p.assignedSectionKeys,
  }));

  return (
    <>
      <MintCampusEditCookie token={campus.access_token} />
      <IntakeClient
        campus={campus}
        sections={intakeSections}
        initialResponses={responseMap}
        initialEditors={editorMap}
        initialRepositoryPhotos={tiles}
        initialComments={commentsBySection}
        token={campus.access_token}
      />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campus = await getCampusBySlug(slug);
  return {
    title: campus ? `${campus.display_name} — campus intake` : "Campus intake",
    robots: { index: false, follow: false },
  };
}
