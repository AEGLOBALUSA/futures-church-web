"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type AIInputProps = {
  placeholder?: string;
  chips?: string[];
  className?: string;
  onSubmit?: (value: string) => void;
  autoFocus?: boolean;
  compact?: boolean;
};

const TYPE_INTERVAL_MS = 22;
const PAUSE_BEFORE_SUBMIT_MS = 300;

export function AIInput({
  placeholder = "Ask Milo anything about Futures…",
  chips = [],
  className,
  onSubmit,
  autoFocus = false,
  compact = false,
}: AIInputProps) {
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { sendMessage, openDock } = useAIGuide();

  const submit = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      openDock();
      if (onSubmit) onSubmit(text);
      else await sendMessage(text);
      setValue("");
    },
    [onSubmit, openDock, sendMessage],
  );

  const morphChip = useCallback(
    (text: string) => {
      if (isTyping) return;
      setIsTyping(true);
      setValue("");
      let i = 0;
      const tick = () => {
        if (i >= text.length) {
          setIsTyping(false);
          setTimeout(() => {
            submit(text);
          }, PAUSE_BEFORE_SUBMIT_MS);
          return;
        }
        setValue((prev) => prev + text.charAt(i));
        i += 1;
        setTimeout(tick, TYPE_INTERVAL_MS);
      };
      tick();
    },
    [isTyping, submit],
  );

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(value);
        }}
        className="relative"
      >
        <div
          className="relative rounded-[28px] border border-glass-border bg-glass-bg animate-input-breathe"
          style={{
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            backdropFilter: "blur(24px) saturate(180%)",
            boxShadow: "0 20px 48px -24px rgba(20,20,20,0.22)",
          }}
        >
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit(value);
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            rows={1}
            readOnly={isTyping}
            className={cn(
              "w-full resize-none bg-transparent px-7 pr-20 outline-none",
              "font-display italic text-ink-900 placeholder:text-ink-400",
              compact
                ? "py-4 text-[clamp(18px,2.2vw,28px)]"
                : "py-6 text-[clamp(28px,4.2vw,72px)]",
            )}
            style={{ lineHeight: 1.1, fontWeight: 300 }}
          />
          <button
            type="submit"
            aria-label="Send"
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "flex h-12 w-12 items-center justify-center rounded-full",
              "bg-ink-900 text-cream transition-transform duration-300 hover:scale-105",
            )}
          >
            <span className="text-lg leading-none">→</span>
          </button>
        </div>
      </form>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => morphChip(chip)}
              className={cn(
                "rounded-full border border-ink-900/10 bg-white/70 px-4 py-2",
                "font-ui text-sm text-ink-600 transition-all hover:-translate-y-0.5 hover:bg-white",
              )}
              style={{ fontSize: 13 }}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
