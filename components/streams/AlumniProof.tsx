"use client";

import Image from "next/image";

type AlumniProofData = {
  published: boolean;
  name: string;
  cohort: string;
  role: string;
  photo: string;
  quote: string;
  outcome: string;
} | undefined;

export function AlumniProof({ data }: { data: AlumniProofData }) {
  if (!data?.published) return null;

  const hasPhoto = data.photo && !data.photo.includes("placeholder");

  return (
    <section
      className="border-t border-ink-900/10 px-6 py-16 sm:px-10"
      style={{ background: "#F7F1E6" }}
    >
      <div className="mx-auto max-w-[900px]">
        <div className="flex flex-col items-start gap-6 rounded-[22px] bg-white p-8 shadow-[0_18px_40px_-22px_rgba(20,20,20,0.2)] sm:flex-row sm:items-center">
          {/* Avatar */}
          <div
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full"
            style={{ background: "#EDE4D3" }}
          >
            {hasPhoto ? (
              <Image
                src={data.photo}
                alt={data.name}
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span
                  className="font-display"
                  style={{ fontSize: 28, fontWeight: 300, color: "#A83D2E" }}
                >
                  {data.name[0]}
                </span>
              </div>
            )}
          </div>

          {/* Quote */}
          <div className="flex-1">
            <p
              className="font-display italic text-ink-900"
              style={{ fontSize: "clamp(1rem,1.8vw,1.25rem)", fontWeight: 300, lineHeight: 1.4 }}
            >
              &ldquo;{data.quote}&rdquo;
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="font-ui text-[12px] font-medium text-ink-900">{data.name}</span>
              <span className="font-ui text-[11px] text-ink-400">·</span>
              <span className="font-ui text-[11px] text-ink-500">{data.cohort}</span>
              <span className="font-ui text-[11px] text-ink-400">·</span>
              <span className="font-ui text-[11px] text-warm-700">{data.role}</span>
            </div>
            {data.outcome && (
              <p className="mt-2 font-ui text-[11px] uppercase tracking-[0.18em] text-warm-600">
                {data.outcome}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
