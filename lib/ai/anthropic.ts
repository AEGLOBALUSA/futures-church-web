import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./system-prompt";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function streamClaude(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void
) {
  const stream = await getClient().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
    stream: true,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      onToken(event.delta.text);
    }
  }

  onDone();
}
