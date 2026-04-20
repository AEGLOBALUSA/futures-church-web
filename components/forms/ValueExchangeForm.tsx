"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

export type VEXFieldKey =
  | "email"
  | "phone"
  | "name"
  | "city"
  | "timezone"
  | "zip"
  | "birthYear"
  | "kidsAges"
  | "lifeStage"
  | "oneThing"
  | "campus"
  | "visitDate"
  | "partySize";

type FieldConfig = {
  label: string;
  placeholder?: string;
  type: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
};

const FIELDS: Record<VEXFieldKey, FieldConfig> = {
  email:     { label: "Email",           placeholder: "you@example.com", type: "email", required: true },
  phone:     { label: "Phone",           placeholder: "+1 555 0000",     type: "tel" },
  name:      { label: "First name",      placeholder: "Your name",       type: "text" },
  city:      { label: "City",            placeholder: "e.g. Adelaide",   type: "text" },
  timezone:  { label: "Timezone",        placeholder: "auto-detected",   type: "text" },
  zip:       { label: "Postcode / ZIP",  placeholder: "5000",            type: "text" },
  birthYear: { label: "Birth year",      placeholder: "e.g. 2008",       type: "number" },
  kidsAges:  { label: "Kids' ages",      placeholder: "e.g. 4, 7",       type: "text" },
  lifeStage: {
    label: "Life stage",
    type: "select",
    options: ["Student", "Single", "Dating", "Married", "Parent", "Empty nest", "Prefer not to say"],
  },
  oneThing:  { label: "One thing on your heart right now (optional)", placeholder: "Anything…", type: "textarea" },
  campus: {
    label: "Which campus?",
    type: "select",
    options: ["Paradise", "Gwinnett", "Adelaide City", "Bali", "Solo", "Futuros Duluth", "Other"],
  },
  visitDate: { label: "Visiting on",     type: "date" },
  partySize: { label: "How many coming?", placeholder: "1", type: "number" },
};

type Props = {
  /** Short value headline shown above the form (1–2 sentences). */
  offer?: string;
  /** Up to 3 trust bullets. */
  proofPoints?: string[];
  /** Fields to collect (hard-capped at 3). */
  fields: VEXFieldKey[];
  /** Submit button label. */
  cta: string;
  /** Short sentence rendered on success. */
  outcome?: string;
  /** CRM source tag — REQUIRED per Round 1 spec. */
  source: string;
  /** Legacy intent alias (maps to source when source is absent). */
  intent?: string;
  dark?: boolean;
  className?: string;
  onSuccess?: (payload: Record<string, string>) => void;
};

export function ValueExchangeForm({
  offer,
  proofPoints,
  fields,
  cta,
  outcome,
  source,
  intent,
  dark = false,
  className,
  onSuccess,
}: Props) {
  const cappedFields = fields.length > 3 ? fields.slice(0, 3) : fields;
  const fieldList = useMemo(
    () => cappedFields.map((f) => ({ key: f, cfg: FIELDS[f] })),
    [cappedFields],
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: source ?? intent ?? "unknown",
          intent: intent ?? source ?? "unknown",
          data: values,
        }),
      });
      if (!res.ok) throw new Error(`Capture failed: ${res.status}`);
      setStatus("ok");
      onSuccess?.(values);
    } catch {
      setStatus("error");
      setError("That didn't send — try again in a moment?");
    }
  }

  const labelClass = dark
    ? "font-ui text-eyebrow uppercase text-cream/70"
    : "font-ui text-eyebrow uppercase text-ink-600";
  const fieldClass = dark
    ? "w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-ui text-[15px] text-cream placeholder:text-cream/40 outline-none focus:border-warm-500"
    : "w-full rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-3 font-ui text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-warm-500";
  const submitClass = dark
    ? "mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-warm-500 px-6 py-3 font-ui text-[15px] text-ink-900 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
    : "mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[15px] text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-60";

  if (status === "ok") {
    return (
      <GlassCard dark={dark} className={cn("p-6 text-center", className)}>
        <p
          className="font-display italic"
          style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.3 }}
        >
          Thanks &mdash; that&rsquo;s with us.
        </p>
        {outcome && (
          <p className={cn("mt-2 font-ui text-sm", dark ? "text-cream/70" : "text-ink-600")}>
            {outcome}
          </p>
        )}
      </GlassCard>
    );
  }

  return (
    <GlassCard dark={dark} className={cn("p-6 sm:p-8", className)}>
      {offer && (
        <p
          className={cn("font-display italic", dark ? "text-cream" : "text-ink-900")}
          style={{ fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 300, lineHeight: 1.3 }}
        >
          {offer}
        </p>
      )}

      {proofPoints && proofPoints.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {proofPoints.slice(0, 3).map((pp) => (
            <li
              key={pp}
              className={cn(
                "flex items-start gap-2 font-ui text-[13px]",
                dark ? "text-cream/80" : "text-ink-600",
              )}
            >
              <span
                aria-hidden
                className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: "#C8906B" }}
              />
              <span>{pp}</span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        {fieldList.map(({ key, cfg }) => {
          const id = `vex-${key}`;
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <label htmlFor={id} className={labelClass}>
                {cfg.label}
              </label>
              {cfg.type === "textarea" ? (
                <textarea
                  id={id}
                  required={cfg.required}
                  placeholder={cfg.placeholder}
                  value={values[key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  rows={3}
                  className={cn(fieldClass, "resize-y")}
                />
              ) : cfg.type === "select" ? (
                <select
                  id={id}
                  required={cfg.required}
                  value={values[key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  className={fieldClass}
                >
                  <option value="">Choose&hellip;</option>
                  {cfg.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type={cfg.type}
                  required={cfg.required}
                  placeholder={cfg.placeholder}
                  value={values[key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  className={fieldClass}
                />
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={status === "sending"}
          className={submitClass}
        >
          {status === "sending" ? "Sending…" : cta}
          <span>→</span>
        </button>

        {error && (
          <p
            className={cn("font-ui text-sm", dark ? "text-warm-300" : "text-warm-700")}
            role="alert"
          >
            {error}
          </p>
        )}
      </form>
    </GlassCard>
  );
}
