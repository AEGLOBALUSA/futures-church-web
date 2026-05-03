// Compatibility shim — used by app/api/guide/route.ts.
// Real content lives in lib/ai/milo-knowledge.ts and is composed in lib/ai/system-prompt.ts.

import type { AIGuideContextName } from "./AIGuideContext";
import { SYSTEM_PROMPT, buildSystemBlocks, buildStaticSystemPrompt } from "./system-prompt";

export const BASE_SYSTEM_PROMPT = SYSTEM_PROMPT;

/**
 * Async — includes live intake data + a language hint when supplied.
 * Use this in API routes that can `await`.
 */
export async function promptFor(
  context: AIGuideContextName,
  language: "en" | "es" | "id" | "pt" = "en"
): Promise<string> {
  const blocks = await buildSystemBlocks(context, language);
  return blocks.map((b) => b.text).join("\n\n");
}

/** Sync — static roster + knowledge only. Use for non-async callers. */
export function promptForSync(context: AIGuideContextName): string {
  return buildStaticSystemPrompt(context);
}
