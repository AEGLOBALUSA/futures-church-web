"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { Message } from "@/lib/ai/AIGuideContext";

const NOTEBOOK_BG = `
  repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 27px,
    rgba(83,77,68,0.12) 28px
  ),
  linear-gradient(180deg, #FDFBF6 0%, #F7F1E6 100%)
`;

type ResponseCardProps = {
  message: Message;
  className?: string;
  children?: ReactNode;
};

export function ResponseCard({ message, className, children }: ResponseCardProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        className={cn(
          "self-end rounded-[22px] rounded-br-md px-5 py-3",
          "bg-ink-900 text-cream font-ui text-[15px] leading-relaxed",
          "max-w-[85%] shadow-[0_10px_24px_-16px_rgba(20,20,20,0.4)]",
          className,
        )}
      >
        {message.content}
        {children}
      </div>
    );
  }

  return (
    <article
      className={cn(
        "relative max-w-[90%] self-start overflow-hidden rounded-[22px] rounded-bl-md",
        "border border-ink-900/5 px-6 py-5 font-body text-ink-900",
        "shadow-[0_12px_32px_-20px_rgba(20,20,20,0.3)]",
        className,
      )}
      style={{
        background: NOTEBOOK_BG,
        fontSize: 16,
        lineHeight: "28px",
      }}
    >
      <div className="absolute left-0 top-0 h-full w-[3px] bg-warm-500/60" aria-hidden />
      <div className="whitespace-pre-wrap">{message.content}</div>
      {children}
    </article>
  );
}
