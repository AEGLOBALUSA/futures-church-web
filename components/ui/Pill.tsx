"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  ({ className, active, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-body-sm font-sans transition-all duration-200 ease-apple",
        active
          ? "border-ink-900 bg-ink-900 text-paper"
          : "border-ink-300/60 bg-paper text-ink-700 hover:border-ink-900/40 hover:text-ink-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Pill.displayName = "Pill";
