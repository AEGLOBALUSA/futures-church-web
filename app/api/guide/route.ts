import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { promptFor } from "@/lib/ai/systemPrompts";
import type { AIGuideContextName } from "@/lib/ai/AIGuideContext";

export const runtime = "edge";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type Payload = {
  message: string;
  context?: AIGuideContextName;
  history?: IncomingMessage[];
};

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const userText = (body.message ?? "").trim();
  if (!userText) return new Response("Empty message", { status: 400 });

  const context = (body.context ?? "other") as AIGuideContextName;
  const history = (body.history ?? [])
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-10);

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: userText },
  ];

  const result = await streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: promptFor(context),
    messages,
    temperature: 0.7,
    maxOutputTokens: 600,
  });

  return result.toTextStreamResponse();
}
