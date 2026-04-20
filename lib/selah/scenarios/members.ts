/**
 * Top 10 member-facing seeded scenarios.
 * (Additional 40 scenarios land in Week 2 per the sprint plan.)
 */

import type { VoiceKey } from "../voices/router";

export type Scenario = {
  id: string;
  prompt: string;
  tags: string[];
  primaryVoice: VoiceKey;
};

export const MEMBER_SCENARIOS: Scenario[] = [
  {
    id: "member-01",
    prompt: "I don't feel connected.",
    tags: ["isolation", "belonging"],
    primaryVoice: "pastor",
  },
  {
    id: "member-02",
    prompt: "I disagree with the vision.",
    tags: ["vision-gap", "submission"],
    primaryVoice: "prophet",
  },
  {
    id: "member-03",
    prompt: "I want deeper teaching.",
    tags: ["discipleship", "hunger"],
    primaryVoice: "strategist",
  },
  {
    id: "member-04",
    prompt: "I feel overlooked.",
    tags: ["affirmation", "calling"],
    primaryVoice: "pastor",
  },
  {
    id: "member-05",
    prompt: "I'm questioning my faith.",
    tags: ["doubt", "deconstruction"],
    primaryVoice: "pastor",
  },
  {
    id: "member-06",
    prompt: "I want to step down from serving.",
    tags: ["burnout", "transition"],
    primaryVoice: "pastor",
  },
  {
    id: "member-07",
    prompt: "I had a bad experience in the past.",
    tags: ["church-hurt", "restoration"],
    primaryVoice: "pastor",
  },
  {
    id: "member-08",
    prompt: "I'm struggling with gossip.",
    tags: ["sin", "repentance"],
    primaryVoice: "prophet",
  },
  {
    id: "member-09",
    prompt: "I'm in a dry season.",
    tags: ["dryness", "first-love"],
    primaryVoice: "pastor",
  },
  {
    id: "member-10",
    prompt: "I want to leave but feel guilty.",
    tags: ["transition", "discernment"],
    primaryVoice: "pastor",
  },
];
