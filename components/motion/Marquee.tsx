"use client";

import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
}

export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden motion-safe:hover:[animation-play-state:paused] ${className ?? ""}`}
    >
      <div className="flex w-max motion-safe:animate-marquee gap-8">
        {children}
        {children}
      </div>
    </div>
  );
}
