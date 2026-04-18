import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ glass = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border",
        glass
          ? "backdrop-blur-xl bg-paper-100/60 border-ink-300/50"
          : "bg-paper-100 border-ink-300/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
