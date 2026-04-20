# Futures Church Website — Build History

Complete record of what's been built in `futures-church-web`, organized by system and by round. Source of truth for "what's done" going into pre-launch.

---

## 1. Stack & conventions

**Framework:** Next.js 15.5.15 (App Router), React 19, TypeScript strict, Tailwind v3.4.
**AI:** `@anthropic-ai/sdk` + `ai` (Vercel AI SDK) + `openai` (fallback).
**Data:** Supabase SSR + js client (`@supabase/ssr`, `@supabase/supabase-js`).
**Motion:** framer-motion 11.18 (everywhere).
**Globe:** cobe 2.0 (WebGL, dynamic-imported).
**Icons:** lucide-react.
**Deploy:** Netlify (`@netlify/plugin-nextjs`).
**Analytics:** Plausible (optional, env-gated).
**Scripts:** `dev`, `build`, `start`, `lint`, `typecheck`.

**Conventions:**
- `app/**/page.tsx` = route shell + metadata. Pages import a client component named `*PageClient` from `components/streams/` (life-stage streams), `components/action/` (action pages), or `components/story/` (narrative pages).
- `"use client"` on any component using hooks / framer-motion.
- Colors and typography flow through tailwind tokens in `tailwind.config.ts` — no raw hex in new code; freestyle hexes were codified during R5.4.
- All form captures go through `ValueExchangeForm` (hard-capped at 3 fields, `source` required).
- AI chat goes through `AIInput` → `AIGuideContext` → `/api/guide`.

---

## 2. Brand system

### Fonts (R5.3 final)
Defined via `next/font/google` in `app/layout.tsx`, exposed as CSS variables:
- `--font-fraunces` → display + body (serif, weights 300/400/500, italic available)
- `--font-inter-tight` → sans + ui + mark (weights 400/500/600)
- Tiempos is not licensed; body is aliased to Fraunces until it is.

Tailwind families:
- `font-display` = Fraunces
- `font-sans` / `font-ui` / `font-mark` = Inter Tight
- `font-body` = Fraunces

All `h1–h6`, `em`, `i` are Fraunces weight-300 by default (`app/globals.css`).

### Color tokens (R5.4 final)
Brand palette from Futures Brand Guidelines V1.0 (Oct '22) lives in `tailwind.config.ts`:

- **Primary vivids:** violet `#5D1FEC`, pink `#E444B9`, lemon `#FFFF5F`, sky `#62B4FF`, ginger `#FF8432`, orange `#C45236`, copper `#AC9B25`, thistle `#C5C6A4`, brown `#765020`, judge `#50482E`.
- **Foundation:** `cream` (DEFAULT + 50/100/200/300/400 warm scale), `warm` (300/400/500/600/700/800), `ink` (950/900/800/700/600/500/400/300), `umber` (900/800/700 for action-page dark surfaces), `obsidian` (9/8/7/6/5/4/3), `bone` (50/100/200), `glass` (bg + border).
- Legacy aliases preserved (`paper`, `ember`, `night`, `pulse`, `kingdom`) so existing classes keep rendering.

CSS vars exposed in `:root` (`app/globals.css`) for gradient builders.

### Effects / animations
- Animations: `marquee`, `fade-up`, `placeholder-in`, `pulse-dot`, `aurora`, `grain`, `glass-breathe`, `input-breathe`.
- Backdrop: `backdrop-blur-glass` (24px).
- Utilities: `.glass`, `.glass-light`, `.grain-overlay`, `.aurora-blob`, `.pulse-dot`, `.section-label`.
- `@media (prefers-reduced-motion: reduce)` globally kills `.grain-overlay` + `.aurora-blob` + compresses all animation durations.
- `:focus-visible` ring = violet 2px outer + 4px translucent violet halo.

---

## 3. Layout primitives

### Root layout — `app/layout.tsx`
- Loads Fraunces + Inter Tight, injects `--font-*` variables on `<html>`.
- Body is light-mode first: `bg-cream font-sans text-ink-900 antialiased`.
- Wraps tree in `<AIGuideProvider>`, renders `<Nav>`, `<main>`, `<Footer>`, `<AIGuideDock>`.
- `themeColor: "#FDFBF6"`.
- Metadata: default title `"Futures Church — One family. 21 campuses. 4 countries."`, description mentions South America launching, OpenGraph + Twitter cards to `/og-default.png` (asset not yet produced).
- Plausible script mounted only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.
- **JSON-LD (R5.8):** Organization + WebSite schemas injected via `<script type="application/ld+json">`.

### `components/layout/Nav.tsx` (R5.1 rewrite)
- Sticky `top-0 inset-x-0 z-50`.
- Items: Campuses, Watch, Selah, **Family** (dropdown: bU Women / Dreamers / Kids / Global College), Daily Word, Give.
- `usePathname()` → `isDark = pathname.startsWith("/selah")` for the dark variant.
- Scroll threshold 40px toggles translucent + backdrop-blur-glass frosted state.
- Family dropdown uses 120ms hover-grace timer; `aria-expanded`, `aria-haspopup="menu"`, `role="menu"`, `role="menuitem"`.
- Mobile: lucide `<Menu>` icon → full-screen overlay `fixed inset-0 z-50 md:hidden`, body scroll locked via `document.body.style.overflow = "hidden"`.
- Desktop CTA: rounded-full `bg-warm-500 text-cream` "Plan a visit".
- Mobile CTA: same, anchored `mt-auto` at bottom of overlay.

### `components/layout/Footer.tsx` (R5.2 rewrite)
- Top strip: 2-column grid. Left = Daily Word eyebrow + `<em>Every morning.</em>` headline + proof copy. Right = `<ValueExchangeForm>` (source `footer-daily-word`, fields `email + timezone`, CTA "Start tomorrow").
- 4 link columns: Campus / Family / Grow / About.
- Brand block: Futures wordmark + "One family across 21 campuses in 4 countries. Since 1922." + Instagram, YouTube, Spotify, Facebook (all aria-labeled).
- Eyebrow strip: `21 campuses · 4 countries · 1 family · since 1922`.
- Bottom strip: © year + Privacy / Accessibility / Sitemap / hello@futures.church.

---

## 4. AI system

### `lib/ai/AIGuideContext.tsx`
Site-wide context providing `isOpen`, `messages`, `unreadCount`, `isStreaming`, `pageContext`, and actions `sendMessage`, `openDock`, `closeDock`, `setPageContext`. Every route that needs chat calls `useAIGuide()` — no bespoke chat state anywhere else.

### `components/ai/AIInput.tsx`
The one textarea primitive used across the site (campuses hero, campus detail, stream hero cards, etc.).
- Renders a glass pill (`rounded-[28px] border border-glass-border bg-glass-bg animate-input-breathe`) + textarea + `→` submit button.
- Optional `chips[]` row below — clicking a chip type-morphs the text into the input at 22ms/char and auto-submits after 300ms.
- `compact` prop for inline use inside dock + glass cards.
- `aria-label={placeholder}` on the textarea (R5.7 fix).
- Submits via `useAIGuide().sendMessage` (or a custom `onSubmit`) and opens the dock.

### `components/ai/AIGuideDock.tsx` (R5.5)
- Fixed floating launcher (bottom-right) and dialog.
- Closed: pill button with animated Sparkles avatar + "Ask anything". Pulses via `animation: inputBreathe` when `unreadCount > 0`; label includes `(N new message)`.
- Open: `motion.aside` 460px wide, 720px max-h, glass surface, live message stream + input.
- `role="dialog"`, `aria-label="Futures guide"`; scroll region has `aria-live="polite" aria-atomic="false"`.
- Dark variant on `/selah` via `usePathname()`: cream-on-umber-900 instead of ink-on-cream.
- Streaming typing indicator (3 bouncing dots) appears when last message is `role: "user"`.

### `components/ai/ResponseCard.tsx`
Message bubble for the dock.

### API routes
- `/api/guide` — main streamed chat endpoint.
- `/api/chat` — alt chat endpoint.
- `/api/capture`, `/api/contact`, `/api/give`, `/api/newsletter`, `/api/prayer`, `/api/visit`, `/api/selah/demo`, `/api/book-chapter`, `/api/bible-app` — typed capture endpoints (Supabase + optional CRM/SMS/email providers in `lib/providers/*`).

### System prompts
`lib/ai/system-prompt.ts` and `lib/ai/systemPrompts.ts` hold per-page-context system prompts.

---

## 5. Forms

### `components/forms/ValueExchangeForm.tsx` (VEX)
- Hard-capped at 3 fields. Available keys: `email`, `phone`, `name`, `city`, `timezone`, `zip`, `birthYear`, `kidsAges`, `lifeStage`, `oneThing`, `campus`, `visitDate`, `partySize`.
- Required props: `fields`, `cta`, `source` (CRM tag). Optional: `offer` (headline), `proofPoints` (≤3 bullets), `outcome` (success copy), `dark`, `onSuccess`.
- `<label htmlFor={id}>` on every field.
- Used in: footer Daily Word, campus-detail plan-a-visit, vision prayer, dreamers capture, kids, women, plan-a-visit, contact, bible-app, books, give, history, leaders, daily-word.

---

## 6. Page inventory

All 18 routes ship with `export const metadata` and an `h1` (via `<h1>`, `<motion.h1>`, or the `<Hero>` primitive).

| Route | Client component | Notes |
|---|---|---|
| `/` (Home) | `components/home/*` (8 sections) | HomeHero → HomeMoments → HomePastors → HomeCampuses → HomeFamily → VoicesRow → HomeRhythms → HomeInvitation |
| `/campuses` | `app/campuses/CampusesHero.tsx` | Cobe globe + country view + level-aware chips + B-roll Ken-Burns |
| `/campuses/[slug]` | `app/campuses/[slug]/page.tsx` | 25 campuses pre-rendered; VEX `campus-visit-${slug}`; 7 cross-links |
| `/about` | `components/story/AboutPageClient.tsx` | |
| `/bible-app` | `components/action/BibleAppPageClient.tsx` | |
| `/books` | `components/action/BooksPageClient.tsx` | |
| `/college` | `components/streams/CollegePageClient.tsx` | Three tracks (Ministry / Business / Creative Arts) |
| `/contact` | `components/action/ContactPageClient.tsx` | |
| `/daily-word` | `components/streams/DailyWordPageClient.tsx` | |
| `/dreamers` | `components/streams/DreamersPageClient.tsx` | Young adults stream |
| `/give` | `components/action/GivePageClient.tsx` | |
| `/history` | `components/story/HistoryPageClient.tsx` | Since 1922 |
| `/kids` | `components/streams/KidsPageClient.tsx` | |
| `/leaders` | `components/story/LeadersPageClient.tsx` | Ashley & Jane = Global Senior; Josh & Sjhana = Australia Lead |
| `/plan-a-visit` | `components/action/PlanAVisitPageClient.tsx` | |
| `/selah` | `components/streams/SelahPageClient.tsx` | Dark theme; triggers dock dark variant |
| `/vision` | `components/story/VisionPageClient.tsx` | 2026→2035 progress: 200 campuses / 10k leaders / 200k souls |
| `/watch` | `components/streams/WatchPageClient.tsx` | |
| `/women` | `components/streams/WomenPageClient.tsx` | bU Women |

---

## 7. Campus system

### Data — `lib/content/campuses.ts`
- 25 campuses across 4 regions: `australia`, `usa`, `indonesia`, `south-america`.
- Fields: `slug`, `name`, `brand` (`futures` | `futuros`), `region`, `country`, `city`, `leadPastors?`, `status` (`active` | `launching` | `online`), `lat`, `lng`, `instagram?`.
- Region `south-america` is all `launching` (4 Venezuela campuses — R4.1 rename from `venezuela` → `south-america`).
- `futuros` brand = Spanish-language campuses (used in USA + South America).

### Globe — `app/campuses/Globe.tsx` (R4.4)
- Cobe WebGL canvas dynamically imported in `CampusesHero.tsx` (`ssr: false`).
- Placeholder = animated radial gradient sphere until chunk loads.
- `reducedMotion` check via `matchMedia("(prefers-reduced-motion: reduce)")` → renders `<StaticGlobeFallback>` (semantic `<nav>` grouped by region) instead of the WebGL canvas.
- Always-rendered sr-only `<nav aria-label="Futures campuses by region">` for screen readers.
- Active dots pulse on a 2.4s cycle (`dotPulseActive`); launching dots pulse on a 4.2s cycle (`dotPulseLaunching`). Each dot carries `data-status` + `globe-dot-${status}` + `aria-label` that appends "(launching)" when relevant.

### Campus hero UX — `app/campuses/CampusesHero.tsx`
- Hero B-roll: 4 Unsplash frames cross-dissolve every 7s with 14s Ken-Burns zoom per frame. Placeholder until real Futures stills are cut.
- Ambient drifting aurora blobs layer + grain overlay.
- Glass card with cursor-aware tilt (±2°, killed by `prefers-reduced-motion`), breathing bg opacity.
- Level-aware chips (`CHIPS_BY_LEVEL`): different 6-chip sets per `globe | australia | usa | indonesia | south-america | global`.
- People row: Ashley / Jane / Josh / Sjhana avatars with campus-pastor caption.
- Shared `AIInput` drives the AI chat.
- `setPageContext("campuses")` on mount.
- `?country=<region>` URL param switches in a `<CountryView>`.

### Campus detail — `app/campuses/[slug]/page.tsx`
- `generateStaticParams` pre-renders all 25 slugs.
- Top: hero image (`priority`), name + city + lead pastors.
- Embedded `<CampusAIPanel>` sets `setPageContext("campus-detail")` + shows level-3 per-campus chips (branches on `launching | online | spanish | has-pastors`).
- For active campuses: `<ValueExchangeForm source="campus-visit-${slug}">` + 7 cross-links (plan-a-visit / watch / leaders / kids / dreamers / women / give), each preserving `?campus=${slug}` or `#campus-${slug}`.
- For launching/online: 4-link "still part of the family" strip.

### Other campus surfaces
- `app/campuses/CountryView.tsx` — per-region drill-down.
- `app/campuses/CampusesMap.tsx` — list view.
- `app/campuses/MomentsReel.tsx` — video/photo reel.
- `app/campuses/PeopleGallery.tsx` — pastor gallery.
- `app/campuses/Invitation.tsx` — footer CTA.

---

## 8. Content

JSON + folder data in `/content`: `about.json`, `college.json`, `contact/`, `daily-word.json`, `dreamers.json`, `give/`, `history/`, `kids.json`, `leaders/`, `selah/`, `sermons.json`, `vision/`, `voices.json`, `women.json`.

`voices.json` holds 20 voice entries; `components/home/VoicesRow.tsx` deterministically rotates a subset weekly via `Math.floor(Date.now() / WEEK_MS)` (R4.2).

---

## 9. Round history

### Round 0 — Foundation
Next.js 15.5 + App Router scaffold. Tailwind tokens (cream / warm / ink / glass / obsidian / bone). Base utilities and primitives. Site-wide focus ring + reduced-motion honoring.

### Round 1 — Capture architecture
`ValueExchangeForm` primitive with 3-field cap + required `source`. API routes `/api/{capture,newsletter,contact,visit,prayer,give}` wired to Supabase + typed provider stubs (`lib/providers/{crm,email,sms}.ts`).

### Round 2 — Streams & actions
All 17 inner pages built: streams (women / dreamers / kids / college / watch / daily-word / selah), actions (plan-a-visit / give / contact / books / bible-app), stories (vision / history / leaders / about).

### Round 3 — AI Guide
`AIGuideContext` + `AIInput` + `AIGuideDock` + `ResponseCard`. `/api/guide` streamed chat via Anthropic SDK. Page-context-aware system prompts.

### Round 4 — Campuses V4
- **R4.1** Venezuela → South America (region + copy + URL). Status stays `launching`.
- **R4.2** `voices.json` expanded to 20 entries; `VoicesRow` deterministic weekly rotation.
- **R4.3** `/campuses` + `/campuses/[slug]` both use shared `AIGuideContext`. Bespoke chat state on hero removed; `<AIInput>` drops in. Level-aware chips (6 per level).
- **R4.4** Globe polish: `reducedMotion` WebGL gate → static fallback; always-rendered sr-only nav; `dotPulseActive`/`dotPulseLaunching` keyframes; status-aware aria-labels.
- **R4.5** Campus detail: 7 cross-links preserving `?campus=${slug}` / `#campus-${slug}`; per-campus VEX `source: campus-visit-${slug}` with pastor first-name in `outcome`; conditional "launching/online" strip.

### Round 5 — Global Pass (this round)
- **R5.1** Nav rewrite — sticky, light/dark (`/selah`), Family dropdown, mobile overlay, warm-500 CTA.
- **R5.2** Footer rewrite — Daily Word VEX, 4 columns, socials, legal strip.
- **R5.3** Font audit — Fraunces + Inter Tight canonical; dead `--font-gal/rhymes/lausanne/tiempos` refs cleaned.
- **R5.4** Color token audit — `cream.{50-400}`, `warm.{400,600,800}`, `umber.{700,800,900}` codified; freestyle hexes collapsed to tokens.
- **R5.5** AIGuideDock polish — dark variant on `/selah`, `role="dialog"`, `aria-live="polite"` message region, dynamic launcher aria-label.
- **R5.6** Perf audit — Globe already dynamic; `optimizePackageImports` on framer-motion + lucide-react; all 18 bundles under 180KB gate (largest `/campuses` = 177KB first-load). AVIF/WebP deferred until real images land.
- **R5.7** A11y audit — `<h1>` verified on all 18 page clients; `aria-label` added to `AIInput` textarea; VEX uses label+htmlFor; site-wide focus-visible + reduced-motion. No empty alt / img-without-alt.
- **R5.8** SEO — `app/sitemap.ts` (18 static routes + 25 campus slugs), `app/robots.ts` (disallow `/api/` + `/dev/`), Organization + WebSite JSON-LD in root layout.

---

## 10. Pre-launch gaps

Nothing code-blocking. Assets + stakeholder sign-off remaining:

1. **OG image** — `/public/og-default.png` is referenced but not produced. Needed 1200×630.
2. **Per-route OG images** — can generate via `next/og` once brand stills land.
3. **Real imagery** — `/public/images/` is empty. Unsplash placeholders in campus hero B-roll + stream pages. Need Futures Sunday B-roll cuts (Hannah), campus photos, pastor portraits.
4. **Futures B-roll video** — currently 4 Unsplash stills with Ken-Burns. Swap to `<video muted autoplay loop playsinline>` when cut.
5. **Plausible domain** — set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env when domain is DNS-ready.
6. **Ashley walkthrough gate** — final creative sign-off before launch.
7. **Lighthouse run** — metrics gate (LCP<1.8s, CLS<0.1, TBT<200ms, a11y=100) requires deployed or locally-served build; not yet run.

---

## 11. Verification

Last green state (end of Round 5):
- `npx tsc --noEmit` → exit 0
- `npx next build` → exit 0
- Static routes: 20 (incl. `/sitemap.xml`, `/robots.txt`). Dynamic: 11 API routes. SSG: 25 `/campuses/[slug]`.
- First Load JS shared: 102 kB. Largest route bundle: `/campuses` @ 177 kB.
