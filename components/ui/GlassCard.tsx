"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  breathe?: boolean;
  dark?: boolean;
  children: ReactNode;
};

export function GlassCard({
  breathe = false,
  dark = false,
  className,
  children,
  style,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] border backdrop-blur-glass",
        breathe && "animate-glass-breathe",
        dark
          ? "border-white/10 bg-[rgba(20,20,23,0.56)] text-cream"
          : "border-glass-border bg-glass-bg text-ink-900",
        className,
      )}
      style={{
        boxShadow: dark
          ? "0 24px 60px -30px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)"
          : "0 20px 48px -24px rgba(20,20,20,0.22), inset 0 0 0 1px rgba(255,255,255,0.5)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        backdropFilter: "blur(24px) saturate(180%)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
