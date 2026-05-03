import Anthropic from "@anthropic-ai/sdk";
import { buildSystemBlocks } from "./system-prompt";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type StreamUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens?: number;
  cacheReadInputTokens?: number;
};

export type StreamClaudeOptions = {
  pageContext?: string;
  /** Coarse language hint from Accept-Language. Default "en". */
  language?: "en" | "es" | "id" | "pt";
  /**
   * Visitor coordinates from a one-tap geolocation prompt. Used this turn to
   * inject a "nearest campuses" system block and never stored anywhere.
   */
  userLocation?: { lat: number; lng: number };
};

export async function streamClaude(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: (usage: StreamUsage) => void,
  options: StreamClaudeOptions = {}
) {
  const system = await buildSystemBlocks(
    options.pageContext,
    options.language ?? "en",
    options.userLocation
  );

  const stream = await getClient().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system,
    messages,
    stream: true,
  });

  let inputTokens = 0;
  let outputTokens = 0;
  let cacheCreationInputTokens: number | undefined;
  let cacheReadInputTokens: number | undefined;

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      onToken(event.delta.text);
    }
    // Token accounting — usage info arrives at message_start (input + cache hits)
    // and message_delta (final output count).
    if (event.type === "message_start" && event.message?.usage) {
      const u = event.message.usage;
      inputTokens = u.input_tokens ?? 0;
      cacheCreationInputTokens = u.cache_creation_input_tokens ?? undefined;
      cacheReadInputTokens = u.cache_read_input_tokens ?? undefined;
    }
    if (event.type === "message_delta" && event.usage) {
      outputTokens = event.usage.output_tokens ?? 0;
    }
  }

  onDone({ inputTokens, outputTokens, cacheCreationInputTokens, cacheReadInputTokens });
}
