"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUserLocation } from "./useUserLocation";

const STORAGE_KEY = "futures-guide-conversation";
const MAX_MESSAGES = 50;

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

export type AIGuideContextName =
  | "home"
  | "campuses"
  | "campus-detail"
  | "watch"
  | "selah"
  | "daily-word"
  | "kids"
  | "women"
  | "dreamers"
  | "college"
  | "about"
  | "vision"
  | "history"
  | "leaders"
  | "plan-a-visit"
  | "give"
  | "contact"
  | "books"
  | "bible-app"
  | "other";

type AIGuideState = {
  messages: Message[];
  isOpen: boolean;
  isStreaming: boolean;
  unreadCount: number;
  pageContext: AIGuideContextName;
  sendMessage: (
    text: string,
    options?: { userLocation?: { lat: number; lng: number } }
  ) => Promise<void>;
  requestLocationAndResend: () => Promise<void>;
  appendAssistantChunk: (id: string, chunk: string) => void;
  openDock: () => void;
  closeDock: () => void;
  setPageContext: (ctx: AIGuideContextName) => void;
  clearConversation: () => void;
};

const AIGuideCtx = createContext<AIGuideState | null>(null);

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AIGuideProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pageContext, setPageContext] = useState<AIGuideContextName>("home");
  const openRef = useRef(isOpen);
  openRef.current = isOpen;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed)) setMessages(parsed.slice(-MAX_MESSAGES));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_MESSAGES)),
      );
    } catch {}
  }, [messages]);

  useEffect(() => {
    function onOpen() {
      setIsOpen(true);
      setUnreadCount(0);
    }
    window.addEventListener("futures:open-dock", onOpen);
    return () => window.removeEventListener("futures:open-dock", onOpen);
  }, []);

  const appendAssistantChunk = useCallback((id: string, chunk: string) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx === -1) {
        return [
          ...prev,
          { id, role: "assistant" as const, content: chunk, createdAt: Date.now() },
        ].slice(-MAX_MESSAGES);
      }
      const next = prev.slice();
      next[idx] = { ...next[idx], content: next[idx].content + chunk };
      return next.slice(-MAX_MESSAGES);
    });
    if (!openRef.current) setUnreadCount((c) => c + 1);
  }, []);

  const { request: requestLocation } = useUserLocation();

  const sendMessage = useCallback(
    async (
      text: string,
      options?: { userLocation?: { lat: number; lng: number } }
    ) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: genId(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));
      setIsStreaming(true);

      const assistantId = genId();
      try {
        const res = await fetch("/api/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            context: pageContext,
            history: messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            userLocation: options?.userLocation,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`Guide request failed: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        setMessages((prev) =>
          [
            ...prev,
            {
              id: assistantId,
              role: "assistant" as const,
              content: "",
              createdAt: Date.now(),
            },
          ].slice(-MAX_MESSAGES),
        );

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) appendAssistantChunk(assistantId, chunk);
        }
      } catch (err) {
        appendAssistantChunk(
          assistantId,
          "Sorry — I lost that thread for a second. Try again?",
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, pageContext, appendAssistantChunk],
  );

  // Triggered when the user clicks Milo's "[share your location]" link.
  // Asks the browser for coordinates, then re-sends the most recent user
  // message with the coordinates attached so Milo can answer with the
  // ranked nearest-campuses block injected into the system prompt.
  const requestLocationAndResend = useCallback(async () => {
    const coords = await requestLocation();
    if (!coords) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const target = lastUser?.content ?? "Where is my closest campus?";
    await sendMessage(target, { userLocation: coords });
  }, [messages, requestLocation, sendMessage]);

  const openDock = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeDock = useCallback(() => setIsOpen(false), []);

  const clearConversation = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo<AIGuideState>(
    () => ({
      messages,
      isOpen,
      isStreaming,
      unreadCount,
      pageContext,
      sendMessage,
      requestLocationAndResend,
      appendAssistantChunk,
      openDock,
      closeDock,
      setPageContext,
      clearConversation,
    }),
    [
      messages,
      isOpen,
      isStreaming,
      unreadCount,
      pageContext,
      sendMessage,
      requestLocationAndResend,
      appendAssistantChunk,
      openDock,
      closeDock,
      clearConversation,
    ],
  );

  return <AIGuideCtx.Provider value={value}>{children}</AIGuideCtx.Provider>;
}

export function useAIGuide() {
  const ctx = useContext(AIGuideCtx);
  if (!ctx) {
    throw new Error("useAIGuide must be used inside <AIGuideProvider>");
  }
  return ctx;
}
