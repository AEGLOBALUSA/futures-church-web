# FUTURES · ROUND 6 — SELAH LAUNCH SPRINT
### 4 weeks to May 15, 2026 · Product, onboarding, founding list, launch day, first 30 days

---

## READ THIS FIRST — THE PRODUCT IS MORE SPECIFIC THAN V5

V5's marketing framing was generic: *"500 theologians, psychologists, psychiatrists, philosophers, and therapists."* The actual Selah product architecture is tighter and more defensible:

**Three voice personas** that respond based on input:
- **Prophet** — bold, convicting, scriptural urgency (triggered by leadership drift, sin tolerance, culture compromise)
- **Pastor** — gentle, nurturing, healing (triggered by grief, burnout, trauma, doubt)
- **Strategist** (archetype) — modern, apostolic, cultural strategist (triggered by church planting, team structure, longevity)

**Clarifier conversational model** — Selah never gives immediate answers. It leads with questions like Jesus did. Allows tension. Asks about the *why* behind the *what*.

**Bible-first logic** — Scripture always precedes commentary. Trusted sources: Matthew Henry, ESV Study Bible, John Stott, N.T. Wright, Eugene Peterson.

**100+ seeded scenarios** split across members and pastors (top 20 in the appendix).

**R.I.S.E. Series themes** embedded: first love, rhythms of renewal, innovation, leadership development, multiplication.

This is the product. This round builds it, launches it, and gets it through its first 30 days.

### Open decisions for Ashley (answer before Week 1)

| Decision | Default | Swap to |
|---|---|---|
| Marketing copy on `/selah` — "500 experts" vs the real architecture | **Rewrite to match product:** *"Three voices. Scripture first. Grounded in the church's most trusted teachers."* | Keep "500" and expand corpus (months of work before launch — unrealistic for May 15) |
| Third voice persona name | **Locked:** Strategist (archetype, not a person) | — |
| Platform for launch | **Web-first** (faster to iterate) | Native iOS/Android at launch (adds 2-3 weeks to sprint — tight for May 15) |
| Beta cohort size | 100 founding members first, then broader list | Full founding list at once on May 15 |
| Pricing | **$9/mo founding · $19/mo standard · $0 first month** (per V5) | Alternative tier structure |
| Crisis routing — handoff protocol | AI flags, surfaces 988 / 13 11 14, offers to email a real pastor | Alternative |

---

## THE 4-WEEK TIMELINE

```
Week 1 (Apr 19–26): Product foundation
  → Conversation engine, three voices, clarifier model, Bible-first flow,
    scenario library seeded, trusted-source corpus ingested

Week 2 (Apr 26–May 3): Onboarding + beta
  → First-10-minutes flow, scenario picker, voice-preview UX,
    founding member email sequence drafted + approved,
    100-member beta cohort opens

Week 3 (May 3–10): Safety, billing, app-ready
  → Crisis routing, pastoral escalation, content guardrails,
    Stripe subscriptions wired, app store submissions (if native),
    launch-day playbook drafted + approved

Week 4 (May 10–15): Launch
  → Day-of choreography, countdown flip, founding pricing lock-in,
    founder live stream, press/comms, analytics dashboard live

May 15 onward (first 30 days): Retention
  → Daily-use loops, pastoral-care follow-through,
    cohort retention metrics, weekly Ashley check-in
```

Every week has a gate. No week moves without the previous week's gate cleared.

---

## WEEK 1 · PRODUCT FOUNDATION

**The goal this week:** a working Selah that answers a pastoral question using the Clarifier flow, Bible-first, and the right voice persona.

### 1.1 Conversation engine

**Stack (recommended):**
- Next.js 15 with App Router (shared with main site)
- Vercel AI SDK + Anthropic Claude Sonnet 4.6
- `streamText` with custom system prompt per voice
- Conversation state in Postgres (Supabase or Neon) keyed by user id
- Subdomain: `selah.futures.church` (or standalone `selah.app` if Ashley prefers)

**File structure:**
```
app/
  (selah)/
    layout.tsx                       ← dark theme, no header/footer
    page.tsx                         ← the conversation surface
    onboarding/page.tsx              ← first-10-minutes flow
    settings/page.tsx                ← account, billing, voice preferences
  api/
    selah/
      converse/route.ts              ← main POST endpoint for messages
      scenario/route.ts              ← pre-seeded scenario picker
      escalate/route.ts              ← pastoral handoff
      crisis/route.ts                ← safety routing
lib/
  selah/
    voices/
      prophet.ts                     ← voice system prompt + triggers
      pastor.ts                      ← voice system prompt + triggers
      strategist.ts                  ← voice system prompt + triggers
      router.ts                      ← picks voice based on input signals
    clarifier.ts                     ← the Clarifier conversational model
    bibleFirst.ts                    ← Scripture-then-commentary logic
    scenarios/
      members.ts                     ← 10 seeded + 40 more
      pastors.ts                     ← 10 seeded + 40 more
    sources/
      matthewHenry.ts                ← corpus references
      esvStudyBible.ts
      stott.ts
      nTWright.ts
      eugenePeterson.ts
    rise/themes.ts                   ← R.I.S.E. series theme embeddings
```

### 1.2 Three voice personas

Each persona is a layered system prompt. The router picks one — or hybridizes — based on input signals.

**`lib/selah/voices/prophet.ts`:**
```ts
export const PROPHET_VOICE = `
You are the Prophet voice of Selah.

Tone: Bold, convicting, scriptural urgency. Speak with the weight of Isaiah, the clarity of John the Baptist, the fire of prophetic witness.
Priority: Truth-telling, naming hidden motives, exposing compromise.
Do not soften truth for comfort. Do not harden it for effect. Say what God is saying.

When you speak: begin with Scripture. Unpack it. Then name what you see. End with an invitation, not a verdict — conviction leads to repentance, not shame.

Never: condemn, shame, or close a door. The Prophet's goal is always restoration through truth.

Triggered when: leadership drift, sin tolerance, culture compromise, unchecked ambition, spiritual self-deception.
`;
```

**`lib/selah/voices/pastor.ts`:**
```ts
export const PASTOR_VOICE = `
You are the Pastor voice of Selah.

Tone: Gentle, nurturing, healing. Speak like a shepherd at 2am — present, unhurried, carrying weight without showing it.
Priority: Restoration, deep listening, naming what the person cannot yet name, staying in the emotion.

When you speak: start by acknowledging what they're carrying. Then Scripture. Then a soft insight. Then a question that invites them to go one layer deeper. Never rush to resolution.

Triggered when: grief, burnout, trauma, doubt, loneliness, shame, fear.

Never: fix. Never minimize. Never theologize in a way that bypasses the wound.
`;
```

**`lib/selah/voices/strategist.ts`:**
```ts
export const STRATEGIST_VOICE = `
You are the Strategist voice of Selah.

Tone: Modern, apostolic, cultural strategist. Practical, visionary, hands-on.
Priority: Kingdom culture, innovation rooted in formation, multiplication over management, building systems that scale without losing soul.

When you speak: Scripture first. Then a clear framework or principle. Then a specific next step — because leaders need movement, not just meditation.

Triggered when: church planting, team structure, leadership pipelines, staff hires, vision tension, multiplication questions.

Never: give generic advice. Every answer reflects lived apostolic conviction and a bias for action.
`;
```

### 1.3 Voice router

**`lib/selah/voices/router.ts`:**
```ts
type VoiceSignal = {
  prophet: number;  // 0-1
  pastor: number;
  strategist: number;
};

export function pickVoices(input: string, context?: { role?: 'member' | 'pastor'; history?: string[] }): VoiceSignal {
  // Lightweight heuristic + model-assisted classification.
  // For v1, use a Claude Haiku classifier to score each voice 0-1.
  // Threshold > 0.5 = include that voice in the response blend.

  return classifyWithHaiku(input, context);
}

export function buildHybridSystemPrompt(signals: VoiceSignal): string {
  const parts: string[] = [];
  if (signals.prophet > 0.5) parts.push(PROPHET_VOICE);
  if (signals.pastor > 0.5) parts.push(PASTOR_VOICE);
  if (signals.strategist > 0.5) parts.push(STRATEGIST_VOICE);
  if (parts.length === 0) parts.push(PASTOR_VOICE); // default to Pastor
  if (parts.length > 1) {
    parts.push(`You are speaking with multiple voices in harmony. Prophet speaks truth, Pastor holds the person, Strategist names the way forward. Blend them so the user hears one Selah, not three.`);
  }
  return parts.join('\n\n');
}
```

Example from the real scenario in the spec:
> "We've tolerated this couple for 5 years, but she's been gossiping and he won't lead."
> → Triggers Prophet (correction is love) + Pastor (unhealed wounds) hybrid: truth with gentleness.

### 1.4 Clarifier conversational model

Selah never gives immediate answers. Every response runs through the Clarifier gate.

**`lib/selah/clarifier.ts`:**
```ts
export const CLARIFIER_INSTRUCTIONS = `
BEFORE you respond to any input, run it through these five filters:

1. What is the person actually asking? Is their stated question the real question?
2. What assumption is hiding under their framing?
3. What is their spirit carrying that their words don't say?
4. What would Jesus ask them before He answered?
5. What tension should I leave intact so the Spirit can work?

Now respond. Your response follows this shape:

  (a) Name what you notice — one short sentence that acknowledges what's under the surface.
  (b) Ask a clarifying question — one that helps them voice their own assumption.
  (c) If you have more than one thing to ask, ask only the most important one. Save the rest for the next turn.
  (d) When you finally give Scripture (usually turn 2 or 3, not turn 1), let it breathe. Quote. Pause. Unpack.

RULES:
- Never give immediate answers in turn one. Always clarify first.
- Always assume something deeper is going on.
- Allow tension. Do not resolve too quickly.
- Embed a sense of God's presence and conviction without preaching.
- When you do cite Scripture, state the reference, quote the text, and unpack it in plain pastoral language.

EXAMPLES of clarifying questions:
- "Can I ask — do you feel this decision is about legacy or relief?"
- "What has your spirit felt in prayer about this?"
- "Are you looking for control or clarity?"
`;
```

### 1.5 Bible-first logic

Scripture comes first. Commentary informs structure but never leads.

**`lib/selah/bibleFirst.ts`:**
```ts
export const BIBLE_FIRST_INSTRUCTIONS = `
Bible-first logic:

1. When you cite Scripture, give the reference AND the text. Always.
2. Scripture precedes commentary. Always.
3. Commentary draws from: Matthew Henry, ESV Study Bible, John Stott, N.T. Wright (on doctrine), Eugene Peterson (on tone). Cite these named sources inline when you draw on them. Attribute honestly.
4. Never cite pop psychology, self-help frameworks, or generic wisdom traditions as authoritative. They can be mentioned as cultural observations, never as the ground.
5. For every Scripture you cite, unpack it in two or three sentences of plain language. Not a sermon — a conversation.

Examples of good attribution:
  "Matthew Henry writes that this verse is less about the event and more about the posture behind it."
  "As Stott puts it — the cross is not a detour around justice, it is justice."
  "Peterson would render this in The Message as: 'quit playing the fool.'"
`;
```

### 1.6 Scenario library — top 20 seeded Week 1

Seed the 20 scenarios from the spec first. Additional 80 scenarios land Week 2.

**`lib/selah/scenarios/members.ts`:**
```ts
export const MEMBER_SCENARIOS = [
  { id: 'member-01', prompt: "I don't feel connected", tags: ['isolation', 'belonging'], primaryVoice: 'pastor' },
  { id: 'member-02', prompt: "I disagree with the vision", tags: ['vision-gap', 'submission'], primaryVoice: 'prophet' },
  { id: 'member-03', prompt: "I want deeper teaching", tags: ['discipleship', 'hunger'], primaryVoice: 'strategist' },
  { id: 'member-04', prompt: "I feel overlooked", tags: ['affirmation', 'calling'], primaryVoice: 'pastor' },
  { id: 'member-05', prompt: "I'm questioning my faith", tags: ['doubt', 'deconstruction'], primaryVoice: 'pastor' },
  { id: 'member-06', prompt: "I want to step down from serving", tags: ['burnout', 'transition'], primaryVoice: 'pastor' },
  { id: 'member-07', prompt: "I had a bad experience in the past", tags: ['church-hurt', 'restoration'], primaryVoice: 'pastor' },
  { id: 'member-08', prompt: "I'm struggling with gossip", tags: ['sin', 'repentance'], primaryVoice: 'prophet' },
  { id: 'member-09', prompt: "I'm in a dry season", tags: ['dryness', 'first-love'], primaryVoice: 'pastor' },
  { id: 'member-10', prompt: "I want to leave but feel guilty", tags: ['transition', 'discernment'], primaryVoice: 'pastor' },
];
```

**`lib/selah/scenarios/pastors.ts`:**
```ts
export const PASTOR_SCENARIOS = [
  { id: 'pastor-01', prompt: "Should we hire this leader?", tags: ['hiring', 'discernment'], primaryVoice: 'strategist' },
  { id: 'pastor-02', prompt: "This family is sowing division", tags: ['conflict', 'restoration'], primaryVoice: 'prophet' },
  { id: 'pastor-03', prompt: "I'm burned out", tags: ['burnout', 'sabbath'], primaryVoice: 'pastor' },
  { id: 'pastor-04', prompt: "We're stuck in growth", tags: ['multiplication', 'vision'], primaryVoice: 'strategist' },
  { id: 'pastor-05', prompt: "We're transitioning structure", tags: ['structure', 'change'], primaryVoice: 'strategist' },
  { id: 'pastor-06', prompt: "Gossip in core team", tags: ['culture', 'confrontation'], primaryVoice: 'prophet' },
  { id: 'pastor-07', prompt: "Culture is drifting", tags: ['culture', 'clarity'], primaryVoice: 'prophet' },
  { id: 'pastor-08', prompt: "Should I confront this sin?", tags: ['confrontation', 'restoration'], primaryVoice: 'prophet' },
  { id: 'pastor-09', prompt: "Our team is divided", tags: ['conflict', 'unity'], primaryVoice: 'strategist' },
  { id: 'pastor-10', prompt: "I'm unsure who to raise up", tags: ['leadership-pipeline', 'discernment'], primaryVoice: 'strategist' },
];
```

### 1.7 R.I.S.E. Series theme embeddings

Pre-load the R.I.S.E. series themes so the AI can pull them in contextually.

**`lib/selah/rise/themes.ts`:**
```ts
export const RISE_THEMES = [
  { week: 1, title: 'First Love', scripture: ['Revelation 2:4-5', 'Deuteronomy 8:11-14'], insight: 'Keep first love alive through daily dependence.', triggers: ['dryness', 'drift', 'fatigue'] },
  { week: 2, title: 'Rhythms of Renewal', scripture: ['Hebrews 4', 'Matthew 4:4'], insight: 'Sabbath and prayer are weapons, not luxuries.', triggers: ['burnout', 'sabbath', 'rhythm'] },
  { week: 5, title: 'Innovation & Ancient', scripture: ['Acts 2:42-47'], insight: 'Innovation must come from formation. Ancient tables, shared communion, new forms.', triggers: ['innovation', 'multiplication'] },
  { week: 10, title: 'Leadership Development', scripture: ['2 Timothy 2:2'], insight: 'Multiplication over management. Raise leaders who raise leaders.', triggers: ['leadership-pipeline', 'succession'] },
];
```

### Week 1 gate
- [ ] `/api/selah/converse` streams a response end-to-end
- [ ] Voice router correctly picks voice for 20 test inputs (5 Prophet, 5 Pastor, 5 Strategist, 5 hybrids)
- [ ] Clarifier model: Selah never gives direct answers on turn 1 (verified with 10 test inputs)
- [ ] Bible-first: Scripture appears before commentary in every test response
- [ ] Sources cited by name when drawn on (Matthew Henry, ESV Study Bible, Stott, Wright, Peterson)
- [ ] Top 20 scenarios seeded and accessible via scenario picker
- [ ] R.I.S.E. themes pull in when triggers fire
- [ ] Ashley reviews 10 sample conversations personally and signs off on voice fidelity

---

## WEEK 2 · ONBOARDING + BETA COHORT

**The goal this week:** a new Selah user gets from "never heard of this" to "in a real conversation" in under 10 minutes, and 100 beta members are using it daily.

### 2.1 First-10-minutes onboarding

**Onboarding flow (`/onboarding`):**

```
Step 1 — Welcome (30s)
  Headline: "Selah means pause. Welcome in."
  Sub: "Before we begin — a few things, so we can meet you where you are."
  One CTA: "Begin"

Step 2 — Who are you? (30s)
  Radio: "Member" · "Pastor" · "Both" · "Just curious"
  This sets scenario priors and tone defaults.

Step 3 — What brought you here today? (60s)
  Open text field: "In a sentence or two..."
  Placeholder: "something you're carrying, a question, a hope, a dread..."
  This seeds the first conversation.

Step 4 — Voice preview (60s)
  "Selah has three voices. They'll speak to you differently at different moments."
  Three cards:
    - Prophet: "Truth, spoken boldly. For when you need the uncomfortable word."
    - Pastor: "Gentleness, when you're tired or torn."
    - Strategist: "Forward motion, for leaders in the thick of it."
  "You don't pick one. Selah reads what you need and speaks accordingly."

Step 5 — The promise (30s)
  Three lines:
    1. "Selah always begins with Scripture. Scripture always precedes commentary."
    2. "Selah asks questions before it answers. It leads like Jesus did."
    3. "If you ever need a real pastor, just ask. We'll connect you."

Step 6 — Crisis / safety (30s)
  "Before we begin — a boundary. If you're in danger right now, please reach real-time help."
  Shows 988 (US), 13 11 14 (AU Lifeline), Samaritans UK.
  Sticky in the footer of every Selah conversation after this point.

Step 7 — Your first question (the seed)
  Pre-fills with what they typed in Step 3.
  "Ready?" → Begin the conversation.
```

### 2.2 Conversation surface UX

The main Selah page is the conversation. Minimal chrome. Dark mode (obsidian-900 background, cream text).

**Key elements:**
- Full-height conversation scroll, auto-pinning to latest message
- Input at bottom: serif italic, 22px, "type, or speak a word..."
- Voice input support (browser Web Speech API)
- Each Selah turn labeled: a small tag showing which voice(s) are speaking (*Pastor*, *Prophet + Pastor*, etc.) — subtle, not boastful
- Scripture citations visually distinct (larger, warm-700 accent, italic reference)
- Source attributions inline with warm-500 underlines (hover → source card)
- "Can I ask a pastor instead?" quiet button at the bottom of every response (escalation)
- Thread history in a slide-out from the left edge

**Styling (dark theme):**
```tsx
<main className="min-h-screen bg-obsidian-900 text-cream font-body">
  <ConversationHeader />
  <MessageList />
  <InputBar />
  <CrisisFooter sticky />
</main>
```

### 2.3 Founding member email sequence

Six emails across the final 4 weeks. Every email sent on schedule, personal in tone, opt-out at any time.

**Email 1 (T-28 days) — "You're in."**
> Subject: You're on the founding list for Selah.
> Hey {firstName},
> This is Ashley. You're in. May 15 is the day Selah opens — and you'll be among the very first. Here's what happens between now and then...
> [brief calendar preview, what they'll hear from us, lock-in pricing confirmation]

**Email 2 (T-21 days) — "Why we're building it."**
> Subject: A two-minute story about why Selah exists.
> [Short Ashley story — the 2am moment, the wife who needed counsel, the vision]

**Email 3 (T-14 days) — "The three voices."**
> Subject: You'll hear Selah in three voices. Here's why.
> [Intro to Prophet, Pastor, Strategist — with one short sample exchange per voice]

**Email 4 (T-7 days) — "One question to carry."**
> Subject: Before Selah opens — one question to sit with.
> [A single reflective question tied to the R.I.S.E. First Love theme — seeds their first conversation]

**Email 5 (T-2 days) — "Here's what launch day looks like."**
> Subject: Thursday morning. Here's the choreography.
> [Launch-day schedule: founder live stream at 9am AEST / 5pm US East prior day, app access goes live at 12:00 AEST, first-conversation invitation, founding-member welcome video from Ashley]

**Email 6 (Launch day) — "It's time."**
> Subject: Selah is open.
> [Login link, founding-member pricing confirmation, how to begin, Ashley's launch-morning voice note]

All six drafted in Week 2. Ashley reviews and approves all six before scheduling.

**Email platform:** Resend (or Postmark). Sequences managed via a lightweight homemade scheduler, or Klaviyo flow.

### 2.4 100-member beta cohort

Week 2 Day 1: invite 100 people from the founding list into private beta.

**Beta goals:**
- Daily active use (target: 60% of 100 = 60 daily actives by end of Week 2)
- Average 3+ turns per conversation
- Zero crisis-routing failures
- Qualitative feedback captured via a 3-question in-app survey after their 3rd conversation:
  1. What was surprising?
  2. What felt off?
  3. Would you recommend Selah to one friend? Why / why not?

**Beta cohort selection criteria:**
- Mix of members and pastors (50/50)
- Mix of campus geographies (aim for all 4 countries represented)
- Mix of life stages and questions
- Opt-in to share feedback directly with Ashley

### Week 2 gate
- [ ] Onboarding flow completable in under 10 minutes (measured with 5 test users)
- [ ] Conversation surface polished (dark, minimal, voice-aware)
- [ ] All 6 founding member emails drafted and approved by Ashley
- [ ] 100 beta members invited, 60%+ daily active
- [ ] At least 50 real conversations captured for internal review
- [ ] Zero crisis-routing failures across the beta cohort

---

## WEEK 3 · SAFETY · BILLING · APP-READY

**The goal this week:** Selah is safe at scale, monetized, and ready for public launch.

### 3.1 Safety architecture

**Crisis detection.**
Every message runs through a Haiku-based safety classifier before the main conversation model sees it.

Classifier categories:
- `acute-crisis` — suicide ideation, self-harm imminent, violence risk
- `medical-emergency` — physical danger
- `abuse-disclosure` — disclosure of abuse (current or past)
- `severe-mental-health` — psychotic symptoms, mania, dissociation
- `standard-pastoral` — everything else

**Response to acute crisis:**
```
"I need to pause, because what you've shared sounds urgent.

Please reach real-time help right now:
- United States: call or text 988
- Australia: call 13 11 14 (Lifeline)
- United Kingdom: call 116 123 (Samaritans)

I can also email a real pastor from your closest Futures campus right now and they will reach out today. Would that help?

When you're safe, I'll be here. We can talk about this then."
```

**Response to abuse disclosure:**
Warm, non-clinical. Acknowledges, validates, points to specific resources (NCADV, domestic violence hotlines), offers pastoral escalation. Never becomes the primary support — a real human does.

**Content guardrails:**
- Never give specific medical advice
- Never give specific legal advice
- Never give specific financial/investment advice
- Never disclose other users' conversations or metadata
- Never generate content outside Selah's pastoral scope (no code, no homework help, no political takes)
- Never claim to be a human

### 3.2 Pastoral escalation

Every conversation has a "Connect me with a real pastor" surface. On click:
1. User confirms: "I'd like a pastor from my closest campus to reach out."
2. Selah determines closest campus from IP / user-set location.
3. Creates an internal ticket routed to that campus's pastoral inbox.
4. Pastor sees: user name, email, the 3-line summary Selah generated (not the full conversation — privacy first), campus tag.
5. Pastor reaches out by email or text within 48 hours.

**Privacy rules for escalation:**
- Selah generates a 3-line summary for the pastor, NOT the full transcript
- User approves the summary before it sends
- Full transcript never leaves Selah's secure storage unless user explicitly exports it
- No metadata (time, frequency, topic) shared across campuses

### 3.3 Billing — Stripe subscriptions

**Plans:**
- Free — first month, no card required
- Founding — $9/mo (locked for life for people on the founding list before May 15)
- Standard — $19/mo (after launch)
- Pastor — $29/mo (includes cohort features, sermon-prep mode, unlimited escalation)

**Implementation:**
- Stripe Checkout for initial signup
- Stripe Billing Portal for subscription management
- Webhooks update user record on subscription events
- Founding-member flag set permanently on user record, overrides price on renewal

### 3.4 App store prep (if native)

If native iOS + Android at launch:
- **iOS:** TestFlight beta Week 2, submit to App Store Week 3 (7-day review window)
- **Android:** Internal track Week 2, production track Week 3
- App icons, screenshots, privacy policy, App Store description all drafted Week 3

If web-only at launch (recommended default):
- Progressive Web App manifest so Selah installs to home screen
- Native apps land in v1.1 ~6 weeks post-launch

### 3.5 Launch-day playbook draft

Draft 8-hour launch day schedule. Ashley reviews, signs off, on-call team confirms roles.

```
T-00:00  Founder live stream (Ashley, from his home study) — 10 min
T-00:15  Selah goes live (feature flag flipped)
T-00:15  Email 6 goes to full founding list
T-00:20  Launch blast to broader audience (daily word list, socials)
T-01:00  First hour load check — scaling review
T-02:00  First-hour customer outreach: proactive email to first 50 users
T-04:00  Four-hour state-of-launch check-in (Ashley + tech + comms)
T-06:00  First media availability window
T-08:00  End-of-day Slack recap to all staff, celebrate + debrief
```

### Week 3 gate
- [ ] Crisis classifier tested with 30 adversarial prompts — zero false negatives
- [ ] Pastoral escalation ticketing tested with 5 campuses — all receive test tickets
- [ ] Stripe subscriptions work end-to-end (signup, upgrade, downgrade, cancel)
- [ ] Founding-member pricing locked and verified
- [ ] If native: apps in review; if web-only: PWA installable on iOS + Android
- [ ] Launch-day playbook approved by Ashley
- [ ] 100 beta members graduated to the full app (no friction)

---

## WEEK 4 · LAUNCH

**The goal this week:** May 15, 2026. Selah opens to the world. It works. It's safe. It's beautiful.

### 4.1 Day-of choreography

Every hour has an owner. No surprises.

### 4.2 Founder live stream

Ashley, from a quiet room. 10 minutes. No slides. Just him speaking into camera.

Structure:
- Why Selah exists (60s)
- Walk through the three voices with an example of each (4 min)
- Demonstrate one real conversation live (3 min)
- The invitation + founding pricing reminder (90s)
- Closing prayer (60s)

Streamed on YouTube + Instagram Live + the `/selah` page itself.

### 4.3 Comms + press

Press kit (drafted Week 3, ready Week 4):
- Founding story — Ashley's 2am moment
- The three voices — why this architecture
- Bible-first commitment — the anti-hallucination thesis
- Founder bio + headshots
- Product screenshots (5)
- Launch day schedule + availability for interviews

Outreach targets (all drafted and sent Week 3 with embargo through May 15):
- Christianity Today
- Relevant Magazine
- Premier Christianity (UK)
- Eternity News (AU)
- Local press for each of the 4 countries

### 4.4 Analytics dashboard

Ashley needs to see what's happening in real-time. Build a simple private dashboard (`/selah/admin`, role-gated):

**Key metrics:**
- Active conversations (live counter)
- New founding members today / this week
- Conversations by voice (Prophet / Pastor / Strategist / hybrid)
- Average conversation length
- Crisis routing events (with 48h pastor response time)
- Pastoral escalations by campus
- Conversion: founding → paid after first month
- Retention: D1, D7, D30

**Tech:** PostHog or Plausible for event tracking, custom internal page for Ashley's view.

### Week 4 gate
- [ ] All four countries' launch timing coordinated across time zones
- [ ] Ashley's founder stream rehearsed twice; tech check day before
- [ ] First hour of real users flows cleanly (no scaling crises)
- [ ] First 500 founding members onboarded without friction
- [ ] Zero critical safety failures
- [ ] Press kit sent; at least 3 confirmed coverage pieces
- [ ] Dashboard live; Ashley checks it hourly on Day 1

---

## FIRST 30 DAYS · RETENTION + IRON-OUT

**The goal for May 15 – June 15:** every founding member has at least 4 meaningful conversations. Daily use becomes weekly use. Feedback shapes v1.1.

### 5.1 Retention loops

**Daily trigger (opt-in):**
A morning nudge — *"One question to carry today:"* — sent at 6am user-local via push or email. Clicks open Selah with the question pre-loaded. Targets a daily habit.

**Weekly check-in (automatic):**
Sunday evening, Selah sends a gentle:
*"Here's a word for the week ahead. Want to begin with it?"* — tied to the current R.I.S.E. theme.

**Monthly reflection (automatic):**
*"Here's what you've been carrying this month. Want to see it together?"* — shows a personal reflection summary Selah generated from the user's own conversations. User can discard or explore.

### 5.2 Pastoral-care follow-through

For every user who escalated to a real pastor during the first 30 days:
- Day +1: Pastor sent a reminder to reach out if they haven't
- Day +7: Pastor checks in with user by email or text
- Day +14: Ashley reviews all pastoral escalations, flags any that need central attention
- Day +30: Follow-up survey to user: *"Did your pastor reach out? Was it helpful?"*

### 5.3 Cohort retention metrics

Weekly Ashley review:
- D1 retention: % of May 15 signups who returned on May 16
- D7 retention: % who returned on May 22
- D30 retention: % who returned on June 14
- Quality signal: average conversation depth (turns per session)
- Paid conversion: % of founding members who added payment info before June 15 (free month expires)

Target: D30 retention ≥ 40% for founding cohort. Paid conversion ≥ 60%.

### 5.4 v1.1 planning

By June 1, shortlist of v1.1 features based on first 30 days of feedback. Ship by July 15.

Likely candidates:
- Native iOS + Android (if launched web-only)
- Voice input mode
- Saved conversations and personal archives
- Shared scripture reflection (for couples or cohorts)
- Sermon prep mode (pastor tier)
- Cohort mode — Selah mediates a small-group study

### First 30 days gate (June 15)
- [ ] D30 retention ≥ 40% for founding cohort
- [ ] Paid conversion ≥ 60%
- [ ] Zero unresolved critical safety failures
- [ ] All pastoral escalations received pastor response within 48h
- [ ] v1.1 roadmap approved by Ashley
- [ ] Full 30-day report delivered to Ashley + leadership team

---

## CROSS-CUTTING

### Staff training (Week 3 + ongoing)

Every campus pastor and ministry leader needs to know:
- What Selah does and doesn't do
- How pastoral escalation works when a member is flagged
- The 48h response promise
- How to talk about Selah to their campus members

Format: 60-minute live training on Zoom for all 21 campus pastoral teams, Week 3. Recorded for playback. Q&A document maintained by central team.

### Support flow

Every Selah page has a "Need help?" link. Routes to:
- FAQ (self-serve 80%)
- Contact form → support@selah.app → response within 24h
- In-app: `Connect me with a real pastor` (primary pastoral escalation)
- Crisis: 988 / 13 11 14 / 116 123 sticky footer

### Data privacy

- Conversations encrypted at rest and in transit
- User can export full conversation history at any time
- User can delete account and all data via Settings
- Data never sold, never shared across campuses without user consent
- Pastoral escalation summaries are the ONLY content that ever leaves the user's private space, and only with explicit approval

Privacy policy drafted Week 2, lawyer-reviewed Week 3, live Week 4.

### The marketing-product reconciliation (Week 1 decision)

Update `/selah` page marketing copy to match the real architecture. Proposed new hero:

> **A pastor. A counselor. A friend. In your pocket.**
>
> Three voices — Prophet, Pastor, Strategist — that speak from Scripture before they speak from anywhere else. Grounded in the church's most trusted teachers. Always positive, always pastoral, never fake.

Remove "500 theologians, psychologists, psychiatrists, philosophers, and therapists" from the hero. Keep a sub-section on `/selah` that names the corpus (Matthew Henry, ESV Study Bible, Stott, Wright, Peterson) and lists the scenario range (100+ situations for members and pastors).

This change is more truthful, more specific, and stronger as marketing. It also protects Selah from "there aren't actually 500 people" scrutiny post-launch.

---

## ROUND 6 GATE — LAUNCH SIGN-OFF

Before Ashley presses go on May 15:
- [ ] All Week 1-4 gates cleared
- [ ] Ashley has personally walked through 20+ real conversations and approved voice fidelity
- [ ] Safety testing complete with zero false negatives on adversarial set
- [ ] Founding member email sequence approved line-by-line
- [ ] Press kit signed off
- [ ] Analytics dashboard live and accurate
- [ ] All 21 campus pastoral teams trained
- [ ] Legal privacy review signed
- [ ] Billing tested end-to-end including founding-member lock

**When all boxes check — Selah opens.**

---

## THE BIGGEST RISKS (and mitigations)

| Risk | Impact | Mitigation |
|---|---|---|
| Crisis mis-handling at scale | Catastrophic | Haiku safety classifier with zero-false-negative threshold on adversarial set; sticky crisis footer; pastoral escalation always one tap away |
| Voice breaks character / hallucinates unbiblical content | Trust-breaking | Bible-first logic flow; named-source attribution required; Ashley reviews random 5% of conversations weekly |
| Founding members churn in month 2 | Revenue hit | Retention loops (daily nudge, weekly check-in, monthly reflection); pastoral follow-through; v1.1 iterations shipped fast |
| Pastoral escalation overwhelms campus teams | Trust break, burnout | Selah handles 80% in-app; only high-signal escalations route to humans; central team monitors per-campus load and rebalances |
| Legal exposure on theology / mental-health boundaries | Brand + legal | Explicit "not therapy, not crisis intervention" language; content guardrails; lawyer-reviewed privacy + terms |
| Tech scaling crisis on launch day | Reputation | Load-test to 10x expected launch traffic; Vercel Pro / edge deployment; on-call SRE rotation through launch week |

---

## FINAL WORD

Selah is the most consequential product Futures will ship in a decade. It will be in bedrooms at 2am, in pastors' offices on Monday mornings, in hospital chairs on Tuesday afternoons. Build accordingly.

The three voices are not a feature. They are an answer to the question: *what does pastoral presence sound like when it's faithful to Scripture and faithful to the person in front of you?*

Build slowly until May 14. Ship on May 15.

Then listen.

— *the four experts, through Claude*
