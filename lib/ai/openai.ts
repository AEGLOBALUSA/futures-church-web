import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./system-prompt";
import type { ChatMessage } from "./anthropic";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function streamOpenAI(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void
) {
  const stream = await getClient().chat.completions.create({
    model: "gpt-4o",
    max_tokens: 1024,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) onToken(delta);
  }

  onDone();
}
