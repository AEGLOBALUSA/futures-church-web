"use client";

import { useState, useCallback, useRef } from "react";

export type Role = "user" | "assistant";
export interface Message { id: string; role: Role; content: string; }

function uuid() {
  return crypto.randomUUID();
}

export function useChat(model: "claude" | "openai" = "claude") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = useRef(uuid());
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (streaming) return;
      setError(null);

      const userMsg: Message = { id: uuid(), role: "user", content };
      const assistantId = uuid();

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setStreaming(true);

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            model,
            sessionId: sessionId.current,
          }),
          signal: abortController.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error("Stream failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data) as { token?: string; error?: string };
              if (parsed.token) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed.token }
                      : m
                  )
                );
              }
            } catch {
              // ignore parse errors on individual chunks
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Something went wrong. Please try again.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setStreaming(false);
      }
    },
    [messages, model, streaming]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStreaming(false);
    setError(null);
    sessionId.current = uuid();
  }, []);

  return { messages, streaming, error, sendMessage, reset };
}
