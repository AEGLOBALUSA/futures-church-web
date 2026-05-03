"use client";

import { useState } from "react";
import type { IntakeComment } from "@/lib/intake/server";

export function CommentThread({
  comments,
  sectionKey,
  token,
  editorName,
  onAdd,
}: {
  comments: IntakeComment[];
  sectionKey: string;
  token: string;
  editorName: string;
  onAdd: (c: IntakeComment) => void;
}) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/intake/comment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          sectionKey,
          body: body.trim(),
          authorName: editorName || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "could not post");
      } else {
        onAdd(json.comment);
        setBody("");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 border-t border-ink-900/10 pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900"
      >
        <span>{open ? "Hide" : "Show"} team notes</span>
        {comments.length > 0 && (
          <span className="rounded-full bg-cream-300 px-2 py-0.5 text-ink-700">{comments.length}</span>
        )}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {comments.length === 0 && (
            <p className="font-sans text-body-sm italic text-ink-500">
              Notes here are for your team — pastors, admins, photographers. We see them too.
            </p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  {c.author_name ?? "Someone"}
                </span>
                <time className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  {new Date(c.created_at).toLocaleString()}
                </time>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap font-sans text-body-sm text-ink-900">{c.body}</p>
            </div>
          ))}

          <div className="rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Note to your team — Pastor Sarah will take photos this Sunday…"
              rows={2}
              maxLength={2000}
              className="w-full resize-y bg-transparent font-sans text-body-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
                {body.length} / 2000
              </span>
              <button
                type="button"
                onClick={submit}
                disabled={busy || !body.trim()}
                className="rounded-full bg-ink-900 px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.2em] text-cream transition hover:bg-warm-700 disabled:opacity-40"
              >
                {busy ? "Posting…" : "Post"}
              </button>
            </div>
            {error && <p className="mt-2 font-sans text-body-sm text-red-700">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
