import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { streamClaude, type StreamUsage } from "@/lib/ai/anthropic";
import { streamOpenAI } from "@/lib/ai/openai";
import { detectLanguageFromHeader } from "@/lib/ai/system-prompt";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkAndIncrement, clientIpFrom } from "@/lib/rate-limit";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(4096),
});

const ChatBodySchema = z.object({
  messages: z.array(MessageSchema).max(40),
  model: z.enum(["claude", "openai"]),
  sessionId: z.string().uuid().optional(),
  /**
   * Visitor-shared coordinates from a one-tap geolocation prompt on the client.
   * Used this turn only — never stored, never logged at precision. The server
   * uses them to compute nearest campuses and inject a system-prompt block.
   */
  userLocation: z
    .object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) })
    .optional(),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ChatBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { messages, model, sessionId, userLocation } = parsed.data;

  // Rate limit — per-IP, 30 chat turns / 5 minutes. Generous enough that a real
  // conversation never hits it; tight enough that runaway-cost abuse is bounded.
  const ip = clientIpFrom(req.headers);
  const rl = await checkAndIncrement({
    key: `chat:${ip}`,
    limit: 30,
    windowSeconds: 300,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate-limited", message: "Slow down a moment — try again in a few minutes." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(rl.resetAtMs / 1000)),
          "Retry-After": String(Math.max(1, Math.ceil((rl.resetAtMs - Date.now()) / 1000))),
        },
      }
    );
  }

  // Detect visitor language from Accept-Language header so Milo can
  // greet a Spanish/Indonesian/Portuguese visitor in their language.
  const language = detectLanguageFromHeader(req.headers.get("accept-language"));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const fullContent: string[] = [];
      let usage: StreamUsage | null = null;

      try {
        const onToken = (token: string) => {
          fullContent.push(token);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}` + "\n\n"));
        };

        const onDone = (u?: StreamUsage) => {
          if (u) usage = u;
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        };

        if (model === "claude") {
          await streamClaude(messages, onToken, onDone, { language, userLocation });
        } else {
          await streamOpenAI(messages, onToken, () => onDone());
        }

        // Fire-and-forget analytics + cost tracking.
        if (isSupabaseConfigured()) {
          const supabase = createSupabaseServiceClient();
          const lastUserMsg = messages[messages.length - 1];
          const fullResponse = fullContent.join("");
          // Log the user prompt (truncated) — keeps the existing analytics shape.
          if (sessionId && lastUserMsg) {
            supabase
              .from("chat_events")
              .insert({
                session_id: sessionId,
                role: lastUserMsg.role,
                content: lastUserMsg.content.slice(0, 500),
              })
              .then(() => {});
          }
          // Log the assistant response with usage metadata for cost tracking.
          if (sessionId) {
            supabase
              .from("chat_events")
              .insert({
                session_id: sessionId,
                role: "assistant",
                content: JSON.stringify({
                  preview: fullResponse.slice(0, 300),
                  model,
                  language,
                  usage,
                }).slice(0, 1000),
              })
              .then(() => {});
          }
        }
      } catch (err) {
        console.error("Chat stream error:", err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}` + "\n\n")
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
