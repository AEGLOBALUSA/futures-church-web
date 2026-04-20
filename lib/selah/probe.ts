/**
 * Admin/test helper for Selah voice routing.
 * Not imported by the public /api/selah/converse route — kept in a separate
 * module so Next.js doesn't complain about non-standard route exports.
 */

import { pickVoices, buildHybridSystemPrompt, type VoiceKey } from "./voices/router";

type UserContext = { role?: "member" | "pastor" | "both" | "curious" };

export async function probeVoices(
  input: string,
  context?: UserContext,
): Promise<{ signals: Awaited<ReturnType<typeof pickVoices>>; active: VoiceKey[] }> {
  const signals = await pickVoices(input, { role: context?.role });
  const { active } = buildHybridSystemPrompt(signals);
  return { signals, active };
}
