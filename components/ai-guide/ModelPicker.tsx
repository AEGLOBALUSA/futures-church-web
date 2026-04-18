"use client";

import { cn } from "@/lib/utils";

type Variant = "paper" | "night" | "glass";

interface ModelPickerProps {
  model: "claude" | "openai";
  onChange: (m: "claude" | "openai") => void;
  variant?: Variant;
}

export function ModelPicker({ model, onChange, variant = "paper" }: ModelPickerProps) {
  const shell =
    variant === "paper"
      ? "bg-bone-100 border-obsidian-300/40"
      : variant === "night"
      ? "bg-obsidian-800 border-bone/10"
      : "bg-obsidian-900/50 border-bone/15 backdrop-blur-md";

  const activeStyle =
    variant === "paper" ? "bg-obsidian-900 text-bone" : "bg-lemon text-obsidian-900";

  const idleStyle =
    variant === "paper" ? "text-obsidian-500 hover:text-obsidian-900" : "text-bone/55 hover:text-bone";

  return (
    <div className={cn("inline-flex rounded-full p-0.5 gap-0.5 border", shell)}>
      {(["claude", "openai"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-sans font-medium tracking-[0.14em] uppercase transition-colors",
            model === m ? activeStyle : idleStyle,
          )}
          aria-pressed={model === m}
        >
          {m === "claude" ? "Claude" : "GPT-4"}
        </button>
      ))}
    </div>
  );
}
