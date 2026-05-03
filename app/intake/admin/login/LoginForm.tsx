"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/intake/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/intake/admin");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "sign-in failed");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <input
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Shared admin password"
        className="w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
      />
      <button
        type="submit"
        disabled={busy || !password}
        className="w-full rounded-full bg-ink-900 px-5 py-3 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700 disabled:opacity-40"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      {error && <p className="font-sans text-body-sm text-red-700">{error}</p>}
    </form>
  );
}
