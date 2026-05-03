import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { InboxClient } from "./InboxClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InboxPage() {
  if (!(await isAdminAuthed())) redirect("/intake/admin/login");

  const supabase = createSupabaseServiceClient();
  const { data: messages } = await supabase
    .from("inbox_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  // Stats for the top tiles.
  const stats = {
    total: messages?.length ?? 0,
    newCount: messages?.filter((m) => m.status === "new").length ?? 0,
    urgent: messages?.filter((m) => m.urgent).length ?? 0,
    sevenDays:
      messages?.filter(
        (m) => new Date(m.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length ?? 0,
  };

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-shell items-center gap-4 px-5 py-3 sm:px-8">
          <Link
            href="/intake/admin"
            className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900"
          >
            ← All campuses
          </Link>
          <span className="ml-auto font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            Inbox
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-5 pb-32 pt-12 sm:px-8 sm:pt-16">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">
          Public messages
        </p>
        <h1 className="mt-3 font-display text-display-xl leading-[0.96] text-ink-900">
          Inbox
        </h1>
        <p className="mt-5 max-w-prose font-display text-body-lg italic text-ink-700">
          Every contact form, plan-a-visit, and prayer request lands here — even if
          email isn&rsquo;t wired up yet. Mark them as you reply.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label="Total" value={stats.total} />
          <Tile label="New" value={stats.newCount} dot="bg-warm-400" />
          <Tile label="Urgent" value={stats.urgent} dot="bg-red-700" />
          <Tile label="Last 7 days" value={stats.sevenDays} dot="bg-emerald-700" />
        </div>

        <InboxClient initialMessages={(messages ?? []) as unknown as InboxMessage[]} />
      </main>
    </div>
  );
}

export const metadata = {
  title: "Inbox — admin",
  robots: { index: false, follow: false },
};

function Tile({ label, value, dot }: { label: string; value: number; dot?: string }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream/95 px-5 py-4">
      <div className="flex items-center gap-2">
        {dot && <span className={`size-1.5 rounded-full ${dot}`} />}
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">{label}</span>
      </div>
      <div className="mt-2 font-display text-display-md leading-none text-ink-900">{value}</div>
    </div>
  );
}

// Importable shape (matches InboxClient.tsx's expectations)
type InboxMessage = {
  id: string;
  source: "contact" | "visit" | "capture" | "prayer" | "newsletter";
  name: string | null;
  email: string | null;
  phone: string | null;
  campus_slug: string | null;
  team: string | null;
  body: Record<string, unknown>;
  urgent: boolean;
  status: "new" | "in-progress" | "replied" | "archived";
  created_at: string;
  responded_at: string | null;
  responded_by: string | null;
};
