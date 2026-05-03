"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Mail, Phone, MapPin, AlertTriangle } from "lucide-react";

export type InboxMessage = {
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

const STATUSES: InboxMessage["status"][] = ["new", "in-progress", "replied", "archived"];
const SOURCES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "contact", label: "Contact" },
  { value: "visit", label: "Plan a visit" },
  { value: "prayer", label: "Prayer" },
  { value: "newsletter", label: "Newsletter" },
  { value: "capture", label: "Capture" },
];

export function InboxClient({ initialMessages }: { initialMessages: InboxMessage[] }) {
  const [messages, setMessages] = useState<InboxMessage[]>(initialMessages);
  const [statusFilter, setStatusFilter] = useState<"all" | InboxMessage["status"]>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (sourceFilter !== "all" && m.source !== sourceFilter) return false;
      return true;
    });
  }, [messages, statusFilter, sourceFilter]);

  async function updateStatus(id: string, next: InboxMessage["status"]) {
    setSavingId(id);
    const res = await fetch("/api/intake/admin/inbox", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    setSavingId(null);
    if (!res.ok) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: next, responded_at: next === "replied" ? new Date().toISOString() : m.responded_at }
          : m
      )
    );
  }

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center gap-2 border-b border-ink-900/10 pb-3">
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500 mr-2">Status:</span>
        {(["all", ...STATUSES] as const).map((s) => (
          <FilterChip
            key={s}
            current={statusFilter}
            value={s}
            label={s === "all" ? "All" : s}
            onClick={() => setStatusFilter(s)}
          />
        ))}
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500 ml-4 mr-2">Source:</span>
        {SOURCES.map((s) => (
          <FilterChip
            key={s.value}
            current={sourceFilter}
            value={s.value}
            label={s.label}
            onClick={() => setSourceFilter(s.value)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-ink-900/15 bg-cream/60 px-7 py-14 text-center">
          <Mail className="mx-auto size-7 text-ink-500" strokeWidth={1.4} />
          <p className="mt-4 font-display italic text-ink-700" style={{ fontSize: 19 }}>
            No messages match these filters.
          </p>
          <p className="mt-2 font-sans text-body-sm text-ink-500">
            When visitors hit Contact, Plan-a-Visit, Prayer, or subscribe to the newsletter, the messages land here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {filtered.map((m) => (
            <Row
              key={m.id}
              message={m}
              expanded={expandedId === m.id}
              saving={savingId === m.id}
              onToggle={() => setExpandedId((id) => (id === m.id ? null : m.id))}
              onStatusChange={(s) => updateStatus(m.id, s)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Row({
  message: m,
  expanded,
  saving,
  onToggle,
  onStatusChange,
}: {
  message: InboxMessage;
  expanded: boolean;
  saving: boolean;
  onToggle: () => void;
  onStatusChange: (s: InboxMessage["status"]) => void;
}) {
  const messageBody = (m.body as Record<string, unknown>)?.message;
  const messageStr = typeof messageBody === "string" ? messageBody : null;
  const requestStr = typeof (m.body as Record<string, unknown>)?.request === "string"
    ? ((m.body as Record<string, unknown>).request as string)
    : null;
  const preview = messageStr ?? requestStr ?? JSON.stringify(m.body).slice(0, 160);

  return (
    <li
      className={`overflow-hidden rounded-2xl border transition ${
        m.status === "new"
          ? "border-warm-400/40 bg-cream/95"
          : "border-ink-900/10 bg-cream/70"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-cream/95"
      >
        <span className="mt-1 shrink-0 text-ink-500">
          {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-accent">
              {m.source}
            </span>
            {m.urgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-700/10 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.22em] text-red-800">
                <AlertTriangle className="size-3" /> urgent
              </span>
            )}
            <StatusBadge status={m.status} />
            <span className="font-display italic text-ink-900" style={{ fontSize: 17, fontWeight: 300 }}>
              {m.name ?? m.email ?? "Anonymous"}
            </span>
            <span className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
              {relativeTime(m.created_at)}
            </span>
          </span>
          <span className="mt-1 block truncate font-sans text-body-sm text-ink-600">
            {preview}
          </span>
        </span>
      </button>

      {expanded && (
        <div className="border-t border-ink-900/10 bg-cream-50 px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {m.email && (
              <Detail icon={<Mail className="size-3.5" />} label="Email">
                <a href={`mailto:${m.email}`} className="text-accent underline underline-offset-4">
                  {m.email}
                </a>
              </Detail>
            )}
            {m.phone && (
              <Detail icon={<Phone className="size-3.5" />} label="Phone">
                <a href={`tel:${m.phone}`} className="text-accent underline underline-offset-4">
                  {m.phone}
                </a>
              </Detail>
            )}
            {m.campus_slug && (
              <Detail icon={<MapPin className="size-3.5" />} label="Campus">
                {m.campus_slug}
              </Detail>
            )}
            {m.team && <Detail label="Team">{m.team}</Detail>}
            <Detail label="Received">
              {new Date(m.created_at).toLocaleString()}
            </Detail>
            {m.responded_at && (
              <Detail label="Replied">
                {new Date(m.responded_at).toLocaleString()}
                {m.responded_by ? ` · ${m.responded_by}` : ""}
              </Detail>
            )}
          </div>

          <div className="mt-5">
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500 mb-2">Message</p>
            <p className="whitespace-pre-wrap rounded-xl border border-ink-900/10 bg-cream/95 px-4 py-3 font-sans text-body text-ink-900">
              {preview}
            </p>
          </div>

          <details className="mt-5">
            <summary className="cursor-pointer font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
              Full payload (JSON)
            </summary>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-mono text-[11px] text-ink-700">
              {JSON.stringify(m.body, null, 2)}
            </pre>
          </details>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500 mr-2">
              Mark as:
            </span>
            {STATUSES.map((s) => {
              const active = m.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => !active && onStatusChange(s)}
                  disabled={active || saving}
                  className={`rounded-full px-3.5 py-1.5 font-ui text-[10px] uppercase tracking-[0.22em] transition ${
                    active
                      ? "bg-ink-900 text-cream"
                      : "border border-ink-900/15 bg-cream/70 text-ink-700 hover:bg-cream-300"
                  }`}
                >
                  {saving && !active ? "…" : s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </li>
  );
}

function Detail({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 font-sans text-body-sm text-ink-900">{children}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: InboxMessage["status"] }) {
  const map = {
    new: { bg: "bg-warm-400/20 text-warm-700", label: "new" },
    "in-progress": { bg: "bg-sky-100 text-sky-700", label: "in-progress" },
    replied: { bg: "bg-emerald-100 text-emerald-700", label: "replied" },
    archived: { bg: "bg-ink-900/10 text-ink-700", label: "archived" },
  } as const;
  const cfg = map[status];
  return (
    <span className={`rounded-full px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.22em] ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

function FilterChip({
  current,
  value,
  label,
  onClick,
}: {
  current: string;
  value: string;
  label: string;
  onClick: () => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 font-ui text-[10px] uppercase tracking-[0.22em] transition ${
        active
          ? "bg-ink-900 text-cream"
          : "border border-ink-900/15 bg-cream/60 text-ink-700 hover:bg-cream-300"
      }`}
    >
      {label}
    </button>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.round(diff / 3600_000)}h ago`;
  if (diff < 30 * 86400_000) return `${Math.round(diff / 86400_000)}d ago`;
  return new Date(iso).toLocaleDateString();
}
