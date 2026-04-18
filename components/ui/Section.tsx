import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article";
  container?: boolean;
  eyebrow?: string;
  headline?: string;
  tone?: "paper" | "paper-100" | "night";
}

export function Section({
  as: Tag = "section",
  container = true,
  eyebrow,
  headline,
  tone = "paper",
  className,
  children,
  ...props
}: SectionProps) {
  const toneClass =
    tone === "night"
      ? "bg-night-900 text-paper"
      : tone === "paper-100"
        ? "bg-paper-100 text-ink-900"
        : "bg-paper text-ink-900";

  const eyebrowColor = tone === "night" ? "text-paper/60" : "text-ink-500";
  const headlineColor = tone === "night" ? "text-paper" : "text-ink-900";

  return (
    <Tag className={cn("py-24 md:py-40", toneClass, className)} {...props}>
      {container ? (
        <div className="mx-auto max-w-shell px-6 sm:px-12 lg:px-20">
          {(eyebrow || headline) && (
            <div className="mb-16 max-w-display">
              {eyebrow && (
                <p
                  className={cn(
                    "font-sans font-medium text-[12px] uppercase tracking-eyebrow mb-5",
                    eyebrowColor,
                  )}
                >
                  {eyebrow}
                </p>
              )}
              {headline && (
                <h2
                  className={cn(
                    "font-display text-display-lg leading-[1.05] tracking-[-0.015em]",
                    headlineColor,
                  )}
                >
                  {headline}
                </h2>
              )}
            </div>
          )}
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}
