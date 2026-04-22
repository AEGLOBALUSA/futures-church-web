"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useChat } from "./useChat";
import { ChatPanel } from "./ChatPanel";
import { ModelPicker } from "./ModelPicker";
import { cn } from "@/lib/utils";

// Six pre-populated prompts visible immediately — research-based F-pattern layout.
// Order matters: top row = highest-signal CTAs (first look), bottom row = secondary.
const PROMPT_CARDS: { title: string; prompt: string; accent: string }[] = [
  { title: "I'm new — what's a Sunday like?", prompt: "I'm new — what happens on a Sunday at Futures?", accent: "bg-lemon" },
  { title: "Find my closest campus",          prompt: "Where is my nearest Futures campus?",           accent: "bg-sky" },
  { title: "When does Selah launch?",         prompt: "What is Selah and when does the app launch?",   accent: "bg-pink" },
  { title: "Ask for prayer",                  prompt: "Can someone pray for me? Here's what's on my heart…", accent: "bg-copper" },
  { title: "Watch the latest sermon",         prompt: "Where can I watch the latest Futures sermon?",  accent: "bg-thistle" },
  { title: "Meet Ashley & Jane Evans",        prompt: "Tell me about Ashley and Jane Evans — the lead pastors.", accent: "bg-copper" },
];

export function AIGuideHero() {
  const [model, setModel] = useState<"claude" | "openai">("claude");
  const { messages, streaming, error, sendMessage } = useChat(model);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const hasMessages = messages.length > 0;

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setInput("");
    sendMessage(trimmed);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
    }
  }

  return (
    <div className="glass rounded-[28px] p-5 sm:p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
      {/* Top bar — status + model picker */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5 text-bone/80 section-label">
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-lemon" />
          <span>MILO · FUTURES AI · ONLINE</span>
        </div>
        <ModelPicker model={model} onChange={setModel} variant="glass" />
      </div>

      {/* Chat history (only appears after first message) */}
      {hasMessages && (
        <div className="mb-5">
          <ChatPanel messages={messages} streaming={streaming} error={error} variant="glass" />
        </div>
      )}

      {/* Input pill */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative flex items-center w-full rounded-full border transition-all ease-apple duration-300",
            "bg-obsidian-800/70 backdrop-blur-xl",
            streaming
              ? "border-lemon/60 shadow-[0_0_0_4px_rgba(255,255,95,0.12)]"
              : "border-bone/15 focus-within:border-bone/40",
          )}
          style={{ height: 68 }}
        >
          <Sparkles className="ml-5 w-[18px] h-[18px] text-lemon flex-shrink-0" strokeWidth={1.75} />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasMessages ? "Ask Milo a follow-up…" : "Ask Milo anything about Futures Church…"}
            aria-label="Ask Milo — the Futures AI guide"
            disabled={streaming}
            className="flex-1 bg-transparent pl-3 pr-3 text-[17px] sm:text-[18px] font-sans text-bone placeholder:text-bone/40 outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            aria-label="Send"
            className={cn(
              "flex-shrink-0 mr-2 flex items-center justify-center w-12 h-12 rounded-full transition-all ease-apple duration-200",
              input.trim() && !streaming
                ? "bg-lemon text-obsidian-900 hover:scale-105"
                : "bg-bone/10 text-bone/40 cursor-not-allowed",
            )}
          >
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </form>

      {/* Visible prompt cards — 2x3 grid on desktop, research-based F-pattern order */}
      {!hasMessages && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PROMPT_CARDS.map((card, i) => (
            <button
              key={card.title}
              type="button"
              onClick={() => submit(card.prompt)}
              className="group relative text-left rounded-2xl bg-obsidian-800/50 hover:bg-obsidian-700/70 border border-bone/10 hover:border-bone/25 transition-all ease-apple duration-200 p-3.5 sm:p-4 overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <span className={cn("mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0", card.accent)} />
                <p className="flex-1 text-[13.5px] sm:text-[14px] leading-snug font-sans text-bone/90 group-hover:text-bone">
                  {card.title}
                </p>
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-bone/40 group-hover:text-bone transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </div>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-apple bg-gradient-to-r from-transparent via-bone/40 to-transparent"
              />
              <span aria-hidden className="section-label absolute top-2 right-2.5 text-bone/20 text-[9px]">
                0{i + 1}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Footer microline */}
      <div className="mt-4 flex items-center justify-center gap-2 text-bone/40 section-label">
        <span>ALWAYS POSITIVE</span>
        <span className="w-1 h-1 rounded-full bg-bone/25" />
        <span>ALWAYS PASTORAL</span>
        <span className="w-1 h-1 rounded-full bg-bone/25" />
        <span>NEVER FAKE</span>
      </div>
    </div>
  );
}
