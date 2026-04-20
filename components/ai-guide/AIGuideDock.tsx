"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useChat } from "./useChat";
import { ChatPanel } from "./ChatPanel";
import { ModelPicker } from "./ModelPicker";
import { cn } from "@/lib/utils";

export function AIGuideDock() {
  const [open, setOpen] = useState(false);

  // Any element on the page can request the dock open by dispatching this event.
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("futures:open-dock", openHandler);
    return () => window.removeEventListener("futures:open-dock", openHandler);
  }, []);
  const [model, setModel] = useState<"claude" | "openai">("claude");
  const { messages, streaming, error, sendMessage, reset } = useChat(model);
  const [input, setInput] = useState("");

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    setInput("");
    sendMessage(trimmed);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-violet text-bone pl-4 pr-5 py-3 font-sans font-medium text-sm shadow-[0_12px_40px_-8px_rgba(93,31,236,0.7)] hover:scale-105 transition-transform ease-apple"
          aria-label="Ask Ezra"
        >
          <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-lemon">
            <Sparkles className="w-3.5 h-3.5 text-obsidian-900" strokeWidth={2} />
          </span>
          Ask Ezra
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm rounded-3xl bg-obsidian-800/95 backdrop-blur-xl border border-bone/15 shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-bone/10 bg-obsidian-900/70">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-lemon pulse-dot" />
              <span className="font-sans font-medium text-sm text-bone">Ezra · Futures AI</span>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); reset(); }}
              className="text-bone/60 hover:text-bone transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 max-h-[360px]">
            {messages.length === 0 ? (
              <p className="text-sm text-bone/55 font-sans text-center mt-6">
                Ask Ezra anything about Futures Church.
              </p>
            ) : (
              <ChatPanel messages={messages} streaming={streaming} error={error} variant="night" />
            )}
          </div>

          <div className="border-t border-bone/10 p-4 space-y-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something…"
                rows={1}
                disabled={streaming}
                className="flex-1 bg-obsidian-900 border border-bone/15 rounded-2xl px-3 py-2 text-sm font-sans text-bone placeholder:text-bone/40 resize-none outline-none focus:border-lemon/60 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || streaming}
                aria-label="Send"
                className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                  input.trim() && !streaming
                    ? "bg-lemon text-obsidian-900 hover:brightness-95"
                    : "bg-bone/10 text-bone/40 cursor-not-allowed",
                )}
              >
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex justify-end">
              <ModelPicker model={model} onChange={setModel} variant="night" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
