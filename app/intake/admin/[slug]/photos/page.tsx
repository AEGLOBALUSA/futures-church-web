import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { getCampusBySlug } from "@/lib/intake/server";
import {
  listRepositoryPhotos,
  getSlotAssignments,
} from "@/lib/intake/photo-repository";
import { PhotoCuratorClient } from "./PhotoCuratorClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CampusPhotoCuratorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdminAuthed())) redirect("/intake/admin/login");
  const { slug } = await params;
  const campus = await getCampusBySlug(slug);
  if (!campus) notFound();

  const [pool, slots] = await Promise.all([
    listRepositoryPhotos(slug),
    getSlotAssignments(slug),
  ]);

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-shell items-center gap-4 px-5 py-3 sm:px-8">
          <Link
            href={`/intake/admin/${slug}`}
            className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900"
          >
            ← {campus.display_name}
          </Link>
          <span className="ml-auto font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            Photo curator
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-5 pb-32 pt-12 sm:px-8 sm:pt-16">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">
          Curating
        </p>
        <h1 className="mt-3 font-display text-display-xl leading-[0.96] text-ink-900">
          {campus.display_name} photos
        </h1>
        <p className="mt-5 max-w-prose font-display text-body-lg italic text-ink-700">
          The pool is everything the campus has uploaded. The slots are what visitors actually
          see. Tap a pool photo to place it; tap a slot to swap or clear.
        </p>

        <PhotoCuratorClient campusSlug={slug} initialPool={pool} initialSlots={slots} />
      </main>
    </div>
  );
}

export const metadata = {
  title: "Photo curator",
  robots: { index: false, follow: false },
};
