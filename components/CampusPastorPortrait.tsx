import Image from "next/image";
import {
  getCampusPortrait,
  getDisplayablePortrait,
  type CampusPortrait,
  type CampusPortraitSecondary,
} from "@/lib/content/campus-portraits";

/**
 * <CampusPastorPortrait />
 *
 * Reads from `content/campus-portraits/<slug>.json` and renders the campus
 * pastor portrait following the Round 7 shoot spec.
 *
 * Silent when the release isn't signed or assets aren't in place. Never leaks
 * an unreleased portrait.
 *
 * Variants:
 *  - hero   (default) 3:4, priority, rounded-[22px], soft shadow — top of campus page
 *  - square 1:1 for Selah / footer / OG cards
 *
 * Positions:
 *  - primary   (default) — renders the main pastor portrait (or Nick+Danielle for Gwinnett)
 *  - secondary — renders hero_secondary only (Gwinnett: Nate+Chloe). Returns null on every other campus.
 */
export function CampusPastorPortrait({
  campusSlug,
  variant = "hero",
  position = "primary",
  className,
  priority,
}: {
  campusSlug: string;
  variant?: "hero" | "square";
  position?: "primary" | "secondary";
  className?: string;
  /** Override priority hint. Defaults: hero=true, square=false. */
  priority?: boolean;
}) {
  const record = getCampusPortrait(campusSlug);
  if (!record) return null;

  if (position === "secondary") {
    return renderSecondary(record, variant, className);
  }

  const displayable = getDisplayablePortrait(campusSlug);
  if (!displayable) return null;

  return renderPrimary(displayable, variant, className, priority);
}

function renderPrimary(
  p: CampusPortrait,
  variant: "hero" | "square",
  className: string | undefined,
  priorityOverride: boolean | undefined,
) {
  const src =
    variant === "square"
      ? p.square ?? p.square_fallback ?? p.hero ?? p.hero_fallback
      : p.hero ?? p.hero_fallback;
  if (!src) return null;

  const aspect = variant === "square" ? "aspect-square" : "aspect-[2/3]";
  const sizes =
    variant === "square"
      ? "(max-width: 768px) 50vw, 320px"
      : "(max-width: 768px) 100vw, 50vw";

  const shouldPrioritize = priorityOverride ?? variant === "hero";
  const names = p.subjects.join(" & ");

  return (
    <figure
      className={[
        "group relative overflow-hidden",
        variant === "hero" ? "rounded-[28px]" : "rounded-[18px]",
        aspect,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: p.dominant_hex ?? "#E8DFD3",
        boxShadow:
          variant === "hero"
            ? "0 48px 96px -32px rgba(18,16,13,0.54)"
            : "0 24px 48px -20px rgba(18,16,13,0.36)",
      }}
    >
      <Image
        src={src}
        alt={p.alt}
        fill
        priority={shouldPrioritize}
        sizes={sizes}
        className="object-cover object-top transition-transform duration-[3500ms] ease-out group-hover:scale-[1.03]"
      />

      {/* Tone wash */}
      {p.dominant_hex && (
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light"
          style={{ background: p.dominant_hex, opacity: 0.1 }}
        />
      )}

      {/* Cinematic bottom gradient + name — hero only */}
      {variant === "hero" && (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 42%, rgba(18,14,10,0.88) 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
            <p
              className="font-display italic text-[#FDFBF6]"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 300,
                lineHeight: 1.1,
              }}
            >
              {names}
            </p>
            <p
              className="mt-2 font-sans"
              style={{
                color: "rgba(253,251,246,0.58)",
                fontSize: 10,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
              }}
            >
              Lead Pastors · {p.campus_name}
            </p>
          </div>
        </>
      )}
    </figure>
  );
}

function renderSecondary(
  record: CampusPortrait,
  variant: "hero" | "square",
  className: string | undefined,
) {
  const sec: CampusPortraitSecondary | undefined = record.hero_secondary;
  if (!sec) return null;
  if (!sec.release_signed) return null;
  const src = sec.hero ?? sec.hero_fallback;
  if (!src) return null;

  const aspect = variant === "square" ? "aspect-square" : "aspect-[3/4]";
  const sizes =
    variant === "square"
      ? "(max-width: 768px) 40vw, 220px"
      : "(max-width: 768px) 50vw, 280px";

  return (
    <figure
      className={[
        "relative overflow-hidden rounded-[18px]",
        aspect,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: record.dominant_hex ?? "#E8DFD3",
        boxShadow: "0 20px 40px -24px rgba(18,16,13,0.36)",
      }}
    >
      <Image
        src={src}
        alt={sec.alt}
        fill
        sizes={sizes}
        className="object-cover object-top"
      />
      {record.dominant_hex && (
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light"
          style={{ background: record.dominant_hex, opacity: 0.1 }}
        />
      )}
    </figure>
  );
}

export default CampusPastorPortrait;
