# JOSH — START HERE

**The Master Overview**

*Read this first. 5 minutes. Then move to the other docs.*

---

## What this is, in one paragraph

The new Futures Church website is built. The pages are designed. The animations work. **The only thing missing is words and photos that describe each of our 21 campuses and our key program pages.** Your job for the next 14 days is to be the engine that gets those words and photos in — either by writing them yourself, delegating to a writer, or chasing the campus pastors to fill in their own.

That's it. The hard engineering is done. The hard *writing* now starts.

---

## Your one login — works everywhere

| | |
|---|---|
| **URL** | https://futures-church.netlify.app/intake/admin/login |
| **Password** | `FCADMIN` (all caps, no spaces) |
| **Lasts** | 30 days from first login |

**Important:** This same password unlocks two completely different surfaces.

| When you log in, you can do this | And also this |
|---|---|
| **The admin dashboards** — see every campus's progress, every slot that needs writing, every visitor message | **In-site editing on every public page** — go to any URL, dashed boxes appear around editable elements, click and type to edit |

You don't need a separate password for "in-site editing." It's the same `FCADMIN`. After login, just visit any page on the site (the homepage, /campuses/paradise, /kids, anywhere) and you can edit it inline.

---

## The two kinds of people who can edit, and what each can touch

This is the only mental model you need:

### 1. **You (admin)** — full power
- Logs in once with `FCADMIN`
- Can edit ANY page on the site
- Can edit any campus's pages
- Can see every dashboard
- Can read the inbox
- Can see who's edited what (activity feed)
- Can re-issue pastor links if needed

### 2. **Each campus pastor** — their campus only
- Gets a unique link from you (one per pastor)
- Clicking the link gives them a 30-day editor session
- Can ONLY edit their own campus pages
- Cannot see the master dashboards or inbox
- Cannot edit other campuses or site-wide pages

You and the 21 pastors edit in parallel. The system tracks who edited what.

---

## The four hats you wear

In rough order of time spent:

### Hat 1 — **Fill in your own assigned slots** (Days 1–5)
There are about 13 site-wide content slots assigned to you (or "Josh Greenwood or appointee"). Things like the Kids program description, the Generosity paragraph, the Selah hero line. **No one else can write these — they're the global pages, not campus pages.** Either you write them or your delegated writer does. List of every one is in `JOSH-2-MASTER-EDIT-LIST.md`.

### Hat 2 — **Send the pastor email and chase laggards** (Day 1, then Day 7, then Day 10)
21 pastors get a unique link from you. Pre-drafted email is at `01-pastor-email-template.md`. CSV with their tokens is at `/tmp/futures-intake-tokens-2026-05-04.csv` on Ashley's machine.

### Hat 3 — **Watch the inbox daily** (5 min/day)
`/intake/admin/inbox` — visitors who hit "Contact" / "Plan a visit" / "Prayer request" land here. Read daily, forward to the right campus pastor.

### Hat 4 — **Spot weirdness in the activity feed** (1 min/day)
`/intake/admin/activity` — live feed of every edit. Skim once a day. If something looks wrong (someone editing in all-caps, a campus's hero suddenly says "test test test"), step in.

---

## Your 14-day journey at a glance

| Day | What | Doc |
|---|---|---|
| **Day 1** (today) | Read the 6 docs in this folder. Log in. Test by editing one slot yourself. | This pack |
| **Day 1** | Send the pastor email — 21 unique emails | `01-pastor-email-template.md` |
| **Days 2–5** | Fill your 13 own-assigned slots | `JOSH-2-MASTER-EDIT-LIST.md`, `JOSH-3-IN-SITE-EDITING.md` |
| **Day 7** | Nudge any pastor below 30% | `03-checklist.md` |
| **Day 10** | Phone-call any pastor still at 0% | `03-checklist.md` |
| **Day 14** | Soft deadline — audit, file gap report to Ashley | `03-checklist.md` |
| **Ongoing** | Daily inbox + activity skim | `JOSH-5-DAILY-CHECKINS.md` |

---

## What's in this folder

Read in this order:

| Doc | What it teaches |
|---|---|
| **`JOSH-1-START-HERE.md`** | (this doc) The big picture |
| **`JOSH-2-MASTER-EDIT-LIST.md`** | How to see every edit needed across the whole site |
| **`JOSH-3-IN-SITE-EDITING.md`** | How the dashed-box inline editor works |
| **`JOSH-4-PHOTOS.md`** | The new photo curator — assigning photos to pages |
| **`JOSH-5-DAILY-CHECKINS.md`** | Inbox + activity feed (5 min/day habits) |
| **`JOSH-6-WHEN-STUCK.md`** | Troubleshooting when something breaks |
| `00-handoff-from-ashley.md` | Cover letter from Ashley |
| `01-pastor-email-template.md` | Pre-drafted email to all 21 pastors |
| `02-walkthrough-script.md` | 3-min video script for you to record |
| `03-checklist.md` | Day-by-day checklist (print this, tick as you go) |

---

## Three things to remember every day

1. **Everything you save goes live the moment you save it.** No review queue. No "draft mode." If you don't want it on the site at 2pm Sunday, don't save it now.

2. **Delegating is encouraged.** Your time is better spent leading. Hand the password to a writer if you have one. Make sure they understand point 1.

3. **When something is broken, text Ashley.** Don't fix it yourself. The breakages will be small (typo in the system, a pastor's link not working, a missing field). Ashley routes it to whoever can fix in 5 minutes.

---

## You can do this

The system is designed so a non-technical person can run it. The hard part isn't the tools — it's the diplomacy of getting 21 busy pastors to write 13 paragraphs each in 14 days. **That's your real job.** The tool is just a tool.

Go.

— Ashley
