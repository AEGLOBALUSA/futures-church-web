"use client";

import { useEffect, useRef } from "react";
import { type Message } from "./useChat";
import { cn } from "@/lib/utils";

type Variant = "paper" | "night" | "glass";

interface ChatPanelProps {
  messages: Message[];
  streaming: boolean;
  error: string | null;
  variant?: Variant;
}

export function ChatPanel({ messages, streaming, error, variant = "paper" }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (messages.length === 0) return null;

  const shell =
    variant === "paper"
      ? "bg-bone-100 border border-obsidian-300/30"
      : variant === "night"
      ? "bg-obsidian-800 border border-bone/10"
      : "bg-obsidian-900/50 border border-bone/10 backdrop-blur-md";

  const userBubble =
    variant === "paper" ? "bg-obsidian-900 text-bone" : "bg-lemon text-obsidian-900";

  const assistantBubble =
    variant === "paper"
      ? "bg-bone text-obsidian-900 border border-obsidian-300/20"
      : "bg-obsidian-800/70 text-bone border border-bone/10";

  const dot = variant === "paper" ? "bg-violet" : "bg-lemon";

  return (
    <div className={cn("max-h-[420px] overflow-y-auto rounded-2xl p-5 space-y-4 text-left", shell)}>
      {messages.map((msg) => (
        <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] font-sans leading-relaxed",
              msg.role === "user" ? userBubble : assistantBubble,
            )}
          >
            {msg.content ? (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            ) : streaming && msg.role === "assistant" ? (
              <span className="inline-flex items-center gap-1.5 py-1">
                <span className={cn("w-1.5 h-1.5 rounded-full animate-bounce", dot)} style={{ animationDelay: "0ms" }} />
                <span className={cn("w-1.5 h-1.5 rounded-full animate-bounce", dot)} style={{ animationDelay: "150ms" }} />
                <span className={cn("w-1.5 h-1.5 rounded-full animate-bounce", dot)} style={{ animationDelay: "300ms" }} />
              </span>
            ) : null}
          </div>
        </div>
      ))}
      {error && (
        <p className={cn("text-xs text-center", variant === "paper" ? "text-pink-700" : "text-pink")}>
          {error}
        </p>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
