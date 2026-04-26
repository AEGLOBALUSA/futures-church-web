# Futures College — Still Needed (Round 4)

Date: 2026-04-27
Owner: Ashley + photo team

This document lists every photographic / content asset blocking full Round 4
delivery on the College landing page. Code is ready; assets are not.

---

## P0 — blocking launch

### Hero rotation (3 of 5 frames pending)
Code: 5-slot leadership rotation built. Ashley + Jane portraits in. The page
currently filters to only render `approved: true` frames so the rotation runs
2-up until the rest land.

Need:
- **Ps Tony Corbridge** — landscape portrait or in-context shot. 16:9 desktop / 4:5 mobile crop. Subject's eyes upper third. Drop at `/public/photos/college/leadership/tony.jpg`. Caption him so he's never confused with Ashley (older bald man).
- **Ps Andy Smith** — same framing rules. Drop at `/public/photos/college/leadership/andy.jpg`.
- **Ps Josh** (surname + role to confirm with Futures Comms) — same framing rules. Drop at `/public/photos/college/leadership/josh.jpg`.

When each lands: flip `approved: true` in `COLLEGE_FRAMES` inside `components/streams/CollegePageClient.tsx`.

### Persona cards (8 of 8 pending)
Code: card structure ready, photo prop optional. Currently text-only.

Need 8 photographs, one per persona — see `docs/college-photo-casting-brief.md` for the casting standard ("reasonably good looking, in shape, on their way in life") and `futures-college-landing-prompt.md` §5 for per-persona shot direction. Drop into `/public/photos/college/personas/{slug}.jpg`. Then set `photo` field on each persona in `content/college.json`.

Personas: school-leaver, parent, spiritually-restless, biblically-curious, sensing-calling, builder, distance-learner, one-subject.

### Story-card environmental portraits (4 of 4 pending)
Code: REAL_STORIES array supports optional `photo` field; falls back to initials avatar.

Need:
- Hannah K. — on a worship platform, mid-rehearsal or service
- Marcus T. — with his youth group
- Priya N. — at her desk in marketing role, Bible visible
- Daniel R. — Sunday at his Atlanta campus

Drop at `/public/photos/college/stories/{firstname}.jpg`. Then set `photo` on each entry.

### Legacy alumni portraits + quotes (4 of 4 pending)
Code: LEGACY_STORIES array supports optional `photo` and `quote` fields.

Need environmental portraits + a one-line pull quote (narrative-strategist written, pastor-signed) per:
- Ps Mark Elmendorp — Lead Pastor, Emerge Church, Brisbane (3 campuses)
- Ps Matt Heins — Lead Pastor, Faith Church, Melbourne (5 campuses)
- Ps Paul Geerling — Lead Pastor, IC Church (14 campuses)
- Ps Janine Donato — Campus Pastor, Futures Salisbury (1,000-strong)

Drop at `/public/photos/college/legacy/{firstname}.jpg`. Quotes go in the LEGACY_STORIES array `quote` field.

### Faculty grid completion
Code: grid restored. Currently 4 named faculty (Ashley, Jane, Andy, Alexis).

Need (optional — leave tile out if portrait not available, don't backfill with stock):
- Jacob Collins portrait (Futures-hosted)
- David Begley portrait (Futures-hosted)

### Block-level imagery
Per `futures-college-landing-prompt.md` §5, every block needs at least one image. Currently text-only or stub:

- **Block C (Hook)** — student watching a free session, headphones, lit by screen
- **Block G (Trust)** — wide cohort/graduation/commissioning shot
- **Block H (No fluff)** — intense classroom moment, books open
- **Block I (Why now)** — empty pulpit / empty pew at dusk (mood, not data)
- **Block J (Streams)** — 4 photos, one per stream including single-subject
- **Block M (Programme)** — 8 images, one per subject
- **Block S (Final apply)** — full-bleed graduating cohort, hands raised

Drop into `/public/photos/college/blocks/{block-letter}/`.

---

## P1 — fix before public launch

### Photo reframing (P0-0c follow-up)
Every existing photo on the page must work with default `object-position: center center`. The codebase no longer has any object-position overrides. If any photo crops badly, replace the source with a properly-framed version. Aspect ratios:

- Hero: 16:9 desktop / 4:5 mobile
- Persona cards: 4:5
- Section bands: 21:9 or 16:9
- Subject's eyes at upper third. Head and shoulders fully in frame.

### Photo sign-off matrix
Per Round 4: portrait specialist · documentary photographer · brand photographer · motion designer · flow specialist · pastoral integrity lead · conversion architect — all sign off before launch.

---

## P2

### Two films pending
- 25-min NT Survey teaser
- 22-min Building High-Performing Teams or AI for Leaders teaser

### Mobile persona carousel
Horizontal scroll on mobile with locked sentence visible by default. Currently grid-stacks on mobile.
