import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Eyebrow({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-sans uppercase text-eyebrow text-ink-500",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
