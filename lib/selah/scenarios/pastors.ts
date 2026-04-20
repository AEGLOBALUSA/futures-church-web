/**
 * Top 10 pastor-facing seeded scenarios.
 * (Additional 40 scenarios land in Week 2 per the sprint plan.)
 */

import type { Scenario } from "./members";

export const PASTOR_SCENARIOS: Scenario[] = [
  {
    id: "pastor-01",
    prompt: "Should we hire this leader?",
    tags: ["hiring", "discernment"],
    primaryVoice: "strategist",
  },
  {
    id: "pastor-02",
    prompt: "This family is sowing division.",
    tags: ["conflict", "restoration"],
    primaryVoice: "prophet",
  },
  {
    id: "pastor-03",
    prompt: "I'm burned out.",
    tags: ["burnout", "sabbath"],
    primaryVoice: "pastor",
  },
  {
    id: "pastor-04",
    prompt: "We're stuck in growth.",
    tags: ["multiplication", "vision"],
    primaryVoice: "strategist",
  },
  {
    id: "pastor-05",
    prompt: "We're transitioning structure.",
    tags: ["structure", "change"],
    primaryVoice: "strategist",
  },
  {
    id: "pastor-06",
    prompt: "Gossip in core team.",
    tags: ["culture", "confrontation"],
    primaryVoice: "prophet",
  },
  {
    id: "pastor-07",
    prompt: "Culture is drifting.",
    tags: ["culture", "clarity"],
    primaryVoice: "prophet",
  },
  {
    id: "pastor-08",
    prompt: "Should I confront this sin?",
    tags: ["confrontation", "restoration"],
    primaryVoice: "prophet",
  },
  {
    id: "pastor-09",
    prompt: "Our team is divided.",
    tags: ["conflict", "unity"],
    primaryVoice: "strategist",
  },
  {
    id: "pastor-10",
    prompt: "I'm unsure who to raise up.",
    tags: ["leadership-pipeline", "discernment"],
    primaryVoice: "strategist",
  },
];
