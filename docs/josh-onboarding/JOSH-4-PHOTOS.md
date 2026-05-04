# JOSH — PHOTOS

**How the campus photo pools and curator work**

*Read after `JOSH-3-IN-SITE-EDITING.md`. 5 minutes.*

---

## The photo system in one paragraph

Each of the 21 campuses has a **photo pool** — a folder of images that the pastor (or whoever they delegate) has uploaded. Then **you curate** which photo from the pool goes into which slot on the campus's page (the hero, the secondary, the leaders portrait, etc.). One pool, multiple destinations. **Pastors don't decide which photo goes where — you do.**

This solves the problem of pastors uploading 30 photos and us having no idea which is the "hero" they wanted shown.

---

## The two roles

| Role | What they do |
|---|---|
| **Pastor** *(or their media person)* | Uploads photos through their intake form. Doesn't choose where each photo goes. Just dumps the campus's best 10–30 photos into the pool. |
| **You (Josh)** | Reviews each campus's pool. Assigns the right photo to the hero slot, the right photo to the secondary, etc. Reorders. Removes any that don't meet the brief. |

---

## Where to find a campus's photo curator

For each campus, the photo curator is at:

```
https://futures-church.netlify.app/intake/admin/[campus-slug]/photos
```

Examples:
- https://futures-church.netlify.app/intake/admin/paradise/photos
- https://futures-church.netlify.app/intake/admin/adelaide-city/photos
- https://futures-church.netlify.app/intake/admin/usa-headquarters/photos

You can also click into any campus from `/intake/admin` (the master grid) and there'll be a "Photos" tab/link.

---

## What you'll see on the photo curator page

The page is split into two halves:

### Top half — **The pool** *(unassigned photos)*
Every photo the pastor has uploaded. Thumbnails. Each has:
- The image itself
- The caption the pastor wrote (if any)
- A button to assign it to a slot

### Bottom half — **The slots** *(where photos go on the campus page)*
A list of the visual slots on the campus's page:
- **Hero photo** — the big one at the top of the campus page
- **Secondary** — the supporting photo lower on the page
- **Leaders portrait** — pastor face shot
- **Mosaic 1, 2, 3, 4** — the smaller grid photos
- **Service photo** — usually a worship/service moment

Each slot shows: the photo currently assigned (if any), and an "unassign" / "swap" option.

---

## How to curate — the typical flow

When a campus's photos start arriving, here's the workflow:

### Step 1 — Open the curator
Go to `/intake/admin/[campus-slug]/photos` for that campus.

### Step 2 — Eyeball the pool
Scan all the photos the pastor uploaded. Quick gut check:
- Are any obviously bad? (low-res, badly lit, screenshot of a screenshot, etc.) → mark for removal
- Is there a clear hero candidate? (best lit, most representative, captures the vibe of THAT campus)
- Is there a leader portrait? (clean shot of the pastor + spouse, eye contact, decent framing)

### Step 3 — Assign the hero first
Pick the strongest single image. Click "Assign → Hero". Done.

### Step 4 — Assign leaders portrait
Pick the cleanest pastor face shot. Click "Assign → Leaders portrait".

### Step 5 — Fill the mosaic
The mosaic slots want **diversity** — not all wide shots, not all close-ups. Mix:
- One service/worship shot
- One small group / community moment
- One outdoor / building shot
- One kids-program shot (if available)

### Step 6 — Review the campus's page
Open the live campus page in another tab: `https://futures-church.netlify.app/campuses/[campus-slug]`. Scroll through. Does it FEEL like that campus? If yes, done. If no, swap photos and re-check.

---

## The Futures photo brief — what makes a "good" photo

You're looking for photos that meet this internal brief:

### ✅ Good
- **Real moments, not posed** — a kid praying, a hand on a shoulder, two people laughing
- **Faces in focus** — eyes visible, real emotion
- **Outside the building when possible** — the world we serve, not just the auditorium
- **Diverse** — different ages, ethnicities, contexts. Reflects our family of nations.
- **Captioned with location/year** if known — gives context

### ❌ Bad
- **Stock photography** — visitors can sniff stock from a mile away
- **Empty auditoriums with stage lights** — looks like every other church
- **Heavily filtered / Instagram-style** — feels dated and try-hard
- **Selfies** — wrong scale, wrong context
- **Group shots where everyone is squinting at the sun**
- **Faces blurred / pixelated** *(unless we're protecting children — and even then, prefer to use a different photo)*

---

## What to do with bad photos

You have three options:

1. **Don't assign it to any slot** — it stays in the pool but isn't visible on the live page. Safe option.
2. **Remove it from the pool** — click the small "remove" / trash icon. *(This doesn't delete it from anywhere except this campus's pool — original is still wherever the pastor uploaded it from.)*
3. **Send a friendly nudge to the pastor** — "Hey, can you send me a couple photos from [last conference / kids' camp]? The current pool is light on community moments."

**Don't be shy about removing things.** A campus page with 4 great photos beats a campus page with 12 mediocre ones.

---

## Reordering photos in the mosaic

The mosaic slots have an order — Mosaic 1, Mosaic 2, Mosaic 3, Mosaic 4. The order matters because it controls visual rhythm on the page.

Most curators start with their strongest photo at Mosaic 1, then alternate close-up and wide shots through Mosaic 4. **Trust the page preview** — open the campus page in another tab and see how the rhythm feels. Swap if needed.

---

## What you DON'T need to do

The photo system is designed to NOT need:

- **Cropping** — the system auto-crops based on the slot's aspect ratio
- **Compressing / resizing** — automatic
- **Renaming files** — captions handle naming
- **Worrying about phone vs DSLR** — both work, the system normalises

If a pastor uploads a 50MB iPhone HEIC file, the system handles it. Don't ask them to "shrink it" or "convert it."

---

## When you're stuck on a campus that has no good photos

Some campuses (especially small new ones) might upload only 3–4 photos, none of which are great. Your options:

1. **Use what's there** — assign the least-bad photo to hero, and leave the mosaic empty. Better empty than bad.
2. **Ask for more** — text the pastor: "Send me 5 more photos of services, events, your community — anything from the last 6 months."
3. **Use Futures-global photos** — there's a "global pool" Ashley can give you access to (general worship, conference, family, etc.). Use sparingly — campus pages should feel local.
4. **Show only the leader portrait** — for very small / new campuses, sometimes a single pastor-couple portrait is enough until they grow.

When in doubt → text Ashley.

---

## A note on permissions and faces

Some campuses operate in countries where photographing people in church can be sensitive (legally or socially). **If a pastor specifically asks "please don't show faces of our congregation publicly"** — respect that. Use:
- Photos from behind the congregation (wide shots)
- Hands raised, no faces visible
- The building / setting only
- Stylised crops that obscure faces

The default is "show real people in real moments." But always defer to the pastor if they've flagged a concern.

---

## When pastors keep uploading after you've curated

A pastor might keep uploading photos over the 14 days. **The curator page always shows the latest pool.** New uploads land in the pool unassigned. You don't have to re-do everything — just glance at new arrivals and decide if any beat what's currently in a slot.

---

**Next doc:** `JOSH-5-DAILY-CHECKINS.md` — the 5-minute daily habits for inbox + activity feed.
