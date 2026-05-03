# Build Plan — Futures Church website

**Source of truth:** the *Design & Plumbing Bible* you wrote at the start of this engagement.
**Drafted:** 2026-05-03. **Owner of execution:** Claude (engineering) + Ashley (decisions / content).

This is the doc that turns the bible into shippable work. Tick boxes as we go.

---

## 1. Where we are now (bible-doc audit)

### Solid
- **App shell:** Next.js 15 (App Router), TS strict, Tailwind v3.4 with full warm palette, Fraunces + Inter Tight, Framer Motion, ~75 routes.
- **Hero:** Glass card, "Come home. Ask Milo.", chip rail, Ken Burns of pastor portraits, region pill fallback. Honors the bible's "one question to home" via AI as the centrepiece.
- **All bible-spec routes scaffolded** (home, /campuses, /campuses/[slug], /plan-a-visit, /watch, /give, /kids, /dreamers, /college, /women, /daily-word, /selah, /vision, /history, /leaders, /contact, /baptism, /books, /bible-app, /privacy, /accessibility).
- **`/what-we-believe`** with the four-pillar summary + the seventeen articles.
- **Milo's brain:** structured knowledge base with prompt caching, beliefs, life stages, products, books, give methods, crisis pathways. Model: claude-sonnet-4-6.
- **Campus intake portal:** /intake/[slug] (autosave, photos, comments) + /intake/admin (master grid, activity feed, seed/copy links).
- **Supabase:** wired for the site + intake. Migration 0002_intake.sql ready.
- **Footer + Nav:** present, with What We Believe in About column.

### Gaps (this plan closes them)
- Service times, addresses, real photos, pastor bios → **content collection in progress via intake portal**.
- Individual leader bios at `/leaders/[slug]` — page route doesn't exist.
- Individual daily-word entries at `/daily-word/[date]` — feed exists, dated detail probably doesn't.
- Sermon series and individual sermons (`/watch/[series]/[sermon]`) — Watch hub exists, deep structure doesn't.
- Real campus map (Mapbox styled) — currently a grid (`CountryPortals`).
- i18n routing for Spanish + Bahasa Indonesia — no locale prefixes yet.
- Email sending (intake invitations, plan-a-visit confirmations) — no provider wired.
- Search across sermons / campuses / content — no Algolia/Meili.
- Geolocation-aware campus suggestion in Milo — Milo can ask but doesn't read browser location.
- Accessibility hardening — `--ink-400` contrast fix, skip-to-content, touch targets, screen reader audit.
- Plausible analytics account, GIVE platform URL, custom domain in Netlify, real photos pipeline.

### Numbers
- Bible specifies ~30 distinct page types. **24 exist with real content shells.** **6 to build.**
- 25 campuses in data file. **0 have full intake content yet** (waiting on pastor inputs).
- ~80% of the bible's *engineering* is done. ~10% of the bible's *content* is done.

---

## 2. The plan — 9 phases, in dependency order

Phases that can run in parallel are noted. **Owner key:** 🛠️ Claude · 👤 Ashley · 🌍 Each campus pastor · 🏢 External team.

---

### Phase A · Content unblock — runs forever, starts now
**Goal:** Get every campus's content into the system so pages stop showing placeholders.

- [ ] 👤 Set `INTAKE_ADMIN_PASSWORD` + `INTAKE_ADMIN_SECRET` in `.env.local` and Netlify
- [ ] 👤 Run migration `0002_intake.sql` against Supabase (`supabase db push` or paste in dashboard)
- [ ] 👤 Sign in at `/intake/admin/login` → `/intake/admin/seed` → "Create links"
- [ ] 👤 Email each campus pastor their unique link with a 1-paragraph "what this is" message
- [ ] 🌍 Each pastor fills the 14-section intake form (target: 80% of campuses ≥50% complete by end of week 2)
- [ ] 👤 Chase any campus that hasn't opened their link by day 4 (admin dashboard shows this)

**Exit:** ≥18 of 21 active campuses have complete intake (≥90% per campus).

---

### Phase B · Plumb the integrations (Week 1, parallel with A)
**Goal:** Connect the site to the real services it needs.

- [ ] 👤 Confirm `futures.church` domain registered + add to Netlify (apex + www)
- [ ] 👤 DNS update; force HTTPS; www→apex redirect
- [ ] 👤 Choose giving platform (Tithe.ly / Pushpay / Planning Center). Account live.
- [ ] 👤 Set `NEXT_PUBLIC_GIVE_URL` in env
- [ ] 👤 Create Plausible site at `futures.church`; `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` already set
- [ ] 🛠️ Audit `/give` page — make sure CTAs route to `NEXT_PUBLIC_GIVE_URL` and don't break if unset
- [ ] 🛠️ Add OG image generators for `/what-we-believe`, `/plan-a-visit`, `/give` (others already have)
- [ ] 🛠️ Wire `from intake → site` data flow (read intake_response in campus pages so submitted content shows on `/campuses/[slug]`)

**Exit:** Domain live on staging. Giving works. Plausible logs first pageview. One campus page shows real intake content end-to-end.

---

### Phase C · Pages the bible specs that don't yet exist
**Goal:** Close the IA gap.

#### C1 · Individual leader bios `/leaders/[slug]` 🛠️
- [ ] Create `app/leaders/[slug]/page.tsx`
- [ ] Generate static params from a `lib/content/leaders.ts` (or pull from intake `pastors` data once available)
- [ ] Layout per bible: large portrait, name, role, campus, full bio, video (optional), back-to-leaders
- [ ] Update `/leaders` cards to link to `[slug]`

#### C2 · Sermon series + individual sermons 🛠️
- [ ] Define `lib/content/series.ts` and `lib/content/sermons.ts` (or pull from CMS once chosen)
- [ ] Create `app/watch/[series-slug]/page.tsx` — series hero + episode list
- [ ] Create `app/watch/[series-slug]/[sermon-slug]/page.tsx` — video player, transcript, related, share
- [ ] Add transcript field for SEO + a11y; lazy-load below the fold
- [ ] Wire YouTube embed (or Mux when chosen) with consent-aware loading

#### C3 · Daily Word per-day pages `/daily-word/[date]` 🛠️
- [ ] Create `app/daily-word/[date]/page.tsx`
- [ ] Slug pattern: `2026-05-03` style
- [ ] Layout: scripture + body + audio (optional) + previous/next + share + subscribe CTA
- [ ] Wire archive index on `/daily-word`

#### C4 · Mapbox-styled campus map 🛠️
- [ ] Add `mapbox-gl` dep; create `MAPBOX_ACCESS_TOKEN` env
- [ ] Build `components/campuses/CampusMap.tsx` with custom warm tile style
- [ ] Replace or supplement `CountryPortals` on `/campuses` with map view + grid toggle
- [ ] Pin clusters per region; popover with photo + service times + "Visit" CTA

**Exit:** All bible IA exists at the route level. Real content for ≥3 campuses, ≥1 series, ≥30 daily-word entries.

---

### Phase D · Make Milo as helpful as a human
**Goal:** Move Milo from "knows the brand" to "answers like a friend who actually lives here."

- [ ] 🛠️ Pull intake data into Milo's per-campus knowledge: when intake_response has service times / address / kids info for a campus, inject it into the system prompt for that campus's questions
- [ ] 🛠️ Tool calls (Anthropic tools) — give Milo structured actions:
  - `set_campus(slug)` — saves campus preference
  - `navigate_to(path)` — page navigation
  - `show_campus_card(slug)` — renders interactive card in chat
  - `show_service_times(slug)` — renders times card
  - `subscribe_daily_word(email)` — server-side subscribe
- [ ] 🛠️ Geolocation: ask "Find your nearest campus?" → on consent, pass lat/lng to Milo → return nearest 1-2 campuses with distance
- [ ] 🛠️ Multilingual: detect `Accept-Language`; greet in Spanish ("Bienvenidos") or Indonesian ("Selamat datang"); switch system prompt language
- [ ] 🛠️ Stress-test suite: 50 prompts in 3 languages incl. crisis path, hostile question, vague intent, location intent. Save log to `dev/milo-stress-results.md`
- [ ] 🛠️ Add sermon RAG: vectorize sermon transcripts, let Milo cite with link + timestamp when asked theology questions
- [ ] 🛠️ Rate limit `/api/chat` per IP (Supabase or Upstash) — 30 messages / 5 min

**Exit:** Milo can say "Sundays at Paradise are at 10am, free parking out the back, and Kids Church takes 5–11" using real campus data, in any of 3 languages, after asking which campus.

---

### Phase E · Internationalization (i18n)
**Goal:** Spanish for Futuros, Indonesian for Indonesia campuses, real not machine.

- [ ] 🛠️ Install `next-intl`; configure with `en` (default, no prefix), `es` (`/es/`), `id` (`/id/`)
- [ ] 🛠️ Wrap all UI strings in translation calls; extract `messages/en.json`, `messages/es.json`, `messages/id.json`
- [ ] 🛠️ Add `lang` attr per locale on `<html>`
- [ ] 🛠️ Language toggle in nav (small globe icon, dropdown)
- [ ] 🛠️ Per-campus language fallback: Futuros campuses default to `es`; Indonesian campuses default to `id`
- [ ] 🌍 Native pastors translate the homepage + Plan-a-Visit + What We Believe into es / id (not Google Translate)
- [ ] 🛠️ Wire intake portal to capture localized story / pastor bio fields per language

**Exit:** `/es/` and `/id/` render full sites. Spanish/Indonesian visitors see their language by default. The four-pillar belief statement reads naturally in each language.

---

### Phase F · Accessibility hardening
**Goal:** WCAG 2.1 AA across every page. No exceptions.

- [ ] 🛠️ Fix `--ink-400` token: bump from `#9E9891` to `#847E78` so it passes 4.5:1 against cream
- [ ] 🛠️ Add visible skip-to-main-content link (first focusable element, sr-only until focused)
- [ ] 🛠️ Audit focus rings: every interactive element gets a 2px warm-500 ring on focus
- [ ] 🛠️ Audit touch targets: minimum 44×44 CSS pixels (especially nav links, region pills, social icons)
- [ ] 🛠️ Add `prefers-reduced-motion` respect to remaining animated components (HomeHero already has it; verify HomeMoments / Mosaic / others)
- [ ] 🛠️ Add `aria-label` to all icon-only buttons; verify nav dropdown ARIA roles
- [ ] 🛠️ Add transcripts on all sermons (Phase C2 covers; here we verify)
- [ ] 🛠️ Manual screen reader pass: NVDA on Windows + VoiceOver on macOS + iOS — every primary journey
- [ ] 🛠️ 200% browser zoom test — no horizontal scroll, no overlapping text on any breakpoint
- [ ] 🛠️ Lighthouse Accessibility ≥95 on home, /campuses/[any], /give, /watch, /plan-a-visit, /what-we-believe

**Exit:** Lighthouse a11y green across spec'd pages; one blind tester completes "find a campus, plan a visit" with VoiceOver.

---

### Phase G · Performance pass
**Goal:** Bible target — LCP <2.5s, FID <100ms, CLS <0.1, Lighthouse ≥90 on every page.

- [ ] 🛠️ Audit photo pipeline: ensure WebP/AVIF with JPEG fallback; `srcset` at 640/960/1280/1920
- [ ] 🛠️ Lazy-load all below-fold images (most are; verify HomeMoments and Mosaic)
- [ ] 🛠️ Code-split: confirm `framer-motion` only loads where used (it's heavy)
- [ ] 🛠️ Eliminate `unoptimized` on Next/Image where possible (replace with `images.remotePatterns` + Sharp)
- [ ] 🛠️ Respect `Save-Data` header in `HomeMoments` (no auto-advance on slow connections)
- [ ] 🛠️ Lighthouse Performance ≥90 on every spec'd page
- [ ] 🛠️ Test on 3G throttle in DevTools — page usable within 5s

**Exit:** All Lighthouse pages green. Vercel/Netlify edge caching healthy.

---

### Phase H · Pre-launch QA
**Goal:** Find every embarrassment before the public does.

- [ ] 🛠️ `npm run build` clean (TypeScript + lint)
- [ ] 🛠️ `npx tsc --noEmit` clean
- [ ] 🛠️ Every form submits to a real destination — test prayer, plan-a-visit, contact, daily-word subscribe, intake save
- [ ] 🛠️ Every email goes to a real inbox (forward `hello@futures.church` to Ashley + admin)
- [ ] 🛠️ OG images render for every page (paste each URL into Slack/iMessage; visual confirm)
- [ ] 🛠️ 404 + 500 pages exist and feel warm (not generic Next.js)
- [ ] 🛠️ Sitemap.xml lists all public pages; robots.txt references it
- [ ] 🛠️ JSON-LD: Organization + Church + Event + VideoObject + Person schemas where applicable
- [ ] 🛠️ Cross-browser: Safari (macOS + iOS), Chrome, Firefox, Edge
- [ ] 🛠️ Cross-device: iPhone SE, iPhone 15, Pixel, iPad, MacBook 13", desktop 27"
- [ ] 🛠️ Light + dark system preferences (we're light-only but verify nothing breaks)
- [ ] 👤 Soft-launch with Ashley + 3 pastors. Listen for "I can't find X."

**Exit:** Soft-launch reviewers report no blocking issues for 48 hours.

---

### Phase I · Launch
- [ ] 👤 Pick a Sunday. Tell the family.
- [ ] 🛠️ DNS cutover; verify HTTPS + redirects
- [ ] 🛠️ Sentry / error monitoring on
- [ ] 🛠️ Plausible custom event tracking on key actions (Plan a Visit submitted, Give clicked, Milo session)
- [ ] 🛠️ Sit on standby for hot-fixes — first 72 hours

**Exit:** Site is live. Visitors are landing. Milo is answering. The intake portal keeps filling in the long tail.

---

## 3. Parallel workstreams (running across all phases)

| Workstream | Owner | Cadence |
|---|---|---|
| Photo collection | 🌍 Each campus | Continuous (gates per-campus go-live) |
| Pastor bios | 🌍 Each pastor couple | Continuous |
| Translations (es / id) | 🌍 Native pastors | Phase E onward |
| Stakeholder review | 👤 Ashley + 2-3 pastors | End of each phase |
| Sermon transcript backlog | 🏢 External transcription service | Phase C2 onward |

---

## 4. Who owns what (single-page summary)

| Item | Owner | Status |
|---|---|---|
| All Next.js engineering | 🛠️ Claude | Ongoing |
| Env vars + secrets | 👤 Ashley | Pending |
| Domain + DNS | 👤 Ashley | Pending |
| Giving platform decision + URL | 👤 Ashley | Pending |
| Plausible site | 👤 Ashley | Pending |
| Mapbox account + token | 👤 Ashley | Pending |
| Email provider (Resend/Postmark) | 👤 Ashley | Pending |
| 21 vs 25 campus reconciliation | 👤 Ashley | Open question |
| Real photos per campus | 🌍 Each pastor | Via intake |
| Pastor bios + portraits | 🌍 Each pastor | Via intake |
| Spanish / Indonesian translation | 🌍 Native pastors | Phase E |
| Sermon library (videos + series) | 🏢 Media team | Phase C2 |
| Book covers (high-res) | 🏢 Marketing | Pre-launch |

---

## 5. What's intentionally deferred (post-launch)

- Email sending for intake invitations (currently copy-paste links — works fine for 25 campuses)
- @-mentions in intake comment threads
- Drag-to-reorder photos in intake gallery
- Multi-user real-time updates in intake form
- Search (Algolia/Meilisearch) — Milo handles search-like queries already
- Dark mode
- RTL language support
- Native mobile apps (Selah app is separate)
- A formal CMS migration (Sanity/Contentful) — `lib/content/*.ts` works fine for V1; migrate when content team grows past 5 people

---

## 6. Definition of done

A phase is done when:
1. Every box in that phase is ticked.
2. The build passes (`npm run build` + `tsc --noEmit`).
3. Lighthouse scores meet the bible's targets for any new page.
4. The exit criterion at the bottom of the phase is met.

The whole project is done when:
- Phases A–I are complete.
- Sunday morning, every campus's congregation can land on the site and find their home in under 30 seconds.
- Milo answers any reasonable question in <2s to first token, in the visitor's language.
- Lighthouse green on every spec'd page.
- An accessibility tester with a screen reader can plan a visit unaided.

---

## 7. Recommended next 5 things to do this week

In strict order:
1. 👤 **Ashley:** set the 2 intake env vars + run the migration → seed campus links → email pastors. (≈30 min, unblocks all of Phase A.)
2. 🛠️ **Claude:** Phase B — wire intake-data → campus pages so submitted content lands on `/campuses/[slug]`. (≈4 hours.)
3. 🛠️ **Claude:** Phase C1 — build `/leaders/[slug]` template + light it up for Ashley & Jane + 3 campus couples. (≈3 hours.)
4. 🛠️ **Claude:** Phase D first slice — pull intake data into Milo's per-campus knowledge so Milo answers with real service times once a campus has filled them in. (≈3 hours.)
5. 👤 **Ashley:** decide 21 vs 25 campus question + register `futures.church` if not done. (≈10 min decision.)

That's the week. Everything else queues behind these.
