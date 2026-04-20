import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode, ElementType } from "react";

type TypoProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

export function Eyebrow({ as = "p", className, children, ...rest }: TypoProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-ui uppercase text-ink-600",
        "text-eyebrow",
        className,
      )}
      style={{ letterSpacing: "0.24em" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Hero({ as = "h1", className, children, ...rest }: TypoProps) {
  const Tag = as;
  return (
    <Tag
      className={cn("font-display text-ink-900", className)}
      style={{
        fontSize: "clamp(2.5rem, 6.2vw, 5.75rem)",
        lineHeight: 1.02,
        letterSpacing: "-0.02em",
        fontWeight: 300,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Sub({ as = "p", className, children, ...rest }: TypoProps) {
  const Tag = as;
  return (
    <Tag
      className={cn("font-body text-ink-600", className)}
      style={{
        fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
        lineHeight: 1.55,
        fontWeight: 400,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
