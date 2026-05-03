import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  Mail,
  Calendar,
  MessageCircle,
  ClipboardList,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type UnifiedEvent = {
  id: string;
  at: string;
  kind:
    | "intake-edit"
    | "intake-photo"
    | "intake-comment"
    | "intake-opened"
    | "event-created"
    | "event-updated"
    | "event-deleted"
    | "inbox-contact"
    | "inbox-visit"
    | "inbox-prayer"
    | "inbox-newsletter"
    | "milo-turn"
    | "other";
  title: string;
  detail?: string;
  campusSlug?: string | null;
  actorName?: string | null;
};

function activityIcon(kind: UnifiedEvent["kind"]) {
  switch (kind) {
    case "intake-edit":
    case "intake-photo":
    case "intake-comment":
    case "intake-opened":
      return <ClipboardList className="size-4 text-warm-700" strokeWidth={1.6} />;
    case "event-created":
    case "event-updated":
    case "event-deleted":
      return <Calendar className="size-4 text-emerald-700" strokeWidth={1.6} />;
    case "inbox-contact":
    case "inbox-visit":
      return <Mail className="size-4 text-accent" strokeWidth={1.6} />;
    case "inbox-prayer":
      return <HeartHandshake className="size-4 text-violet-700" strokeWidth={1.6} />;
    case "inbox-newsletter":
      return <Mail className="size-4 text-emerald-700" strokeWidth={1.6} />;
    case "milo-turn":
      return <Sparkles className="size-4 text-warm-500" strokeWidth={1.6} />;
    default:
      return <MessageCircle className="size-4 text-ink-500" strokeWidth={1.6} />;
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.round(diff / 3600_000)}h ago`;
  return `${Math.round(diff / 86400_000)}d ago`;
}

export default async function ActivityPage() {
  if (!(await isAdminAuthed())) redirect("/intake/admin/login");

  const supabase = createSupabaseServiceClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [intakeAct, eventAct, inboxMsgs, miloTurns] = await Promise.all([
    supabase
      .from("intake_activity")
      .select("id, campus_slug, event_type, description, actor_name, created_at")
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("campus_event_activity")
      .select("id, campus_slug, event_type, description, actor_name, created_at")
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("inbox_messages")
      .select("id, source, name, email, campus_slug, body, created_at")
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("chat_events")
      .select("id, session_id, role, content, created_at")
      .eq("role", "user")
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const events: UnifiedEvent[] = [];

  for (const r of intakeAct.data ?? []) {
    let kind: UnifiedEvent["kind"] = "intake-edit";
    if (r.event_type === "photo_uploaded") kind = "intake-photo";
    else if (r.event_type === "comment_added") kind = "intake-comment";
    else if (r.event_type === "opened") kind = "intake-opened";
    events.push({
      id: `intake-${r.id}`,
      at: r.created_at,
      kind,
      title: r.description ?? r.event_type,
      campusSlug: r.campus_slug ?? null,
      actorName: r.actor_name ?? null,
    });
  }
  for (const r of eventAct.data ?? []) {
    const kind =
      r.event_type === "deleted"
        ? "event-deleted"
        : r.event_type === "updated"
        ? "event-updated"
        : "event-created";
    events.push({
      id: `event-${r.id}`,
      at: r.created_at,
      kind,
      title: r.description ?? r.event_type,
      campusSlug: r.campus_slug ?? null,
      actorName: r.actor_name ?? null,
    });
  }
  for (const r of inboxMsgs.data ?? []) {
    const kind = `inbox-${r.source}` as UnifiedEvent["kind"];
    events.push({
      id: `inbox-${r.id}`,
      at: r.created_at,
      kind,
      title: `${r.source} from ${r.name ?? r.email ?? "anonymous"}`,
      detail:
        typeof (r.body as Record<string, unknown> | null)?.message === "string"
          ? ((r.body as Record<string, unknown>).message as string).slice(0, 140)
          : undefined,
      campusSlug: r.campus_slug ?? null,
      actorName: r.name ?? null,
    });
  }
  for (const r of miloTurns.data ?? []) {
    events.push({
      id: `milo-${r.id}`,
      at: r.created_at,
      kind: "milo-turn",
      title: typeof r.content === "string" ? `"${r.content.slice(0, 80)}"` : "Milo conversation",
    });
  }

  events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  // Group by day for readability.
  const byDay: Record<string, UnifiedEvent[]> = {};
  for (const e of events) {
    const d = new Date(e.at);
    const key = d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(e);
  }
  const days = Object.keys(byDay);

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-shell items-center gap-4 px-5 py-3 sm:px-8">
          <Link
            href="/intake/admin"
            className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900"
          >
            ← Dashboard
          </Link>
          <span className="ml-auto font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            Activity · last 7 days
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-5 pb-32 pt-12 sm:px-8 sm:pt-16">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">Activity</p>
        <h1 className="mt-3 font-display text-display-xl leading-[0.96] text-ink-900">
          What&rsquo;s been happening
        </h1>
        <p className="mt-5 max-w-prose font-display text-body-lg italic text-ink-700">
          Every campus edit, photo upload, event change, contact form, prayer request, and
          Milo conversation — across every campus — for the last seven days.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label="Intake edits" value={(intakeAct.data ?? []).filter((r) => r.event_type === "field_saved").length} />
          <Tile label="Events touched" value={(eventAct.data ?? []).length} />
          <Tile label="Inbox messages" value={(inboxMsgs.data ?? []).length} />
          <Tile label="Milo turns" value={(miloTurns.data ?? []).length} />
        </div>

        {events.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-ink-900/15 bg-cream/60 px-7 py-14 text-center">
            <p className="font-display italic text-ink-700" style={{ fontSize: 19 }}>
              Quiet week. No activity in the last seven days.
            </p>
            <p className="mt-2 font-sans text-body-sm text-ink-500">
              When pastors start filling intake or events, you&rsquo;ll see every action here.
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-10">
            {days.map((day) => (
              <section key={day}>
                <h2 className="font-ui text-[10px] uppercase tracking-[0.28em] text-ink-500">
                  {day}
                </h2>
                <ul className="mt-4 divide-y divide-ink-900/5 rounded-3xl border border-ink-900/10 bg-cream/95">
                  {byDay[day].map((e) => (
                    <li key={e.id} className="flex items-start gap-3 px-5 py-3">
                      <span className="mt-1 shrink-0">{activityIcon(e.kind)}</span>
                      <span className="flex-1 min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          {e.actorName && (
                            <span
                              className="font-display italic text-ink-900"
                              style={{ fontSize: 15, fontWeight: 300 }}
                            >
                              {e.actorName}
                            </span>
                          )}
                          {e.campusSlug && (
                            <span className="rounded-full bg-cream-300 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.22em] text-ink-700">
                              {e.campusSlug}
                            </span>
                          )}
                          <span className="font-sans text-body-sm text-ink-700">
                            {e.title}
                          </span>
                          <time className="ml-auto font-ui text-[10px] uppercase tracking-[0.2em] text-ink-400">
                            {relativeTime(e.at)}
                          </time>
                        </span>
                        {e.detail && (
                          <p className="mt-0.5 truncate font-sans text-body-sm text-ink-500">
                            {e.detail}
                          </p>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export const metadata = {
  title: "Activity — admin",
  robots: { index: false, follow: false },
};

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream/95 px-5 py-4">
      <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">{label}</span>
      <div className="mt-2 font-display text-display-md leading-none text-ink-900">{value}</div>
    </div>
  );
}
