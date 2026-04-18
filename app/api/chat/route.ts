import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { streamClaude } from "@/lib/ai/anthropic";
import { streamOpenAI } from "@/lib/ai/openai";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(4096),
});

const ChatBodySchema = z.object({
  messages: z.array(MessageSchema).max(40),
  model: z.enum(["claude", "openai"]),
  sessionId: z.string().uuid().optional(),
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

  const { messages, model, sessionId } = parsed.data;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const fullContent: string[] = [];

      try {
        const onToken = (token: string) => {
          fullContent.push(token);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}` + "\n\n"));
        };

        const onDone = () => {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        };

        if (model === "claude") {
          await streamClaude(messages, onToken, onDone);
        } else {
          await streamOpenAI(messages, onToken, onDone);
        }

        // Fire-and-forget analytics log
        if (isSupabaseConfigured() && sessionId) {
          const supabase = createSupabaseServiceClient();
          const lastUserMsg = messages[messages.length - 1];
          if (lastUserMsg) {
            supabase
              .from("chat_events")
              .insert({
                session_id: sessionId,
                role: lastUserMsg.role,
                content: lastUserMsg.content.slice(0, 500),
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
