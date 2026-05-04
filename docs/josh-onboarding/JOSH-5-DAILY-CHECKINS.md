# JOSH — DAILY CHECK-INS

**The two 5-minute habits that keep the site healthy**

*Read after `JOSH-4-PHOTOS.md`. 5 minutes.*

---

## TL;DR

Two URLs. Open both once a day. Total time: 5 minutes.

| URL | What it shows | Time |
|---|---|---|
| **`/intake/admin/inbox`** | Visitor messages (contact, prayer, visits) | 3 min |
| **`/intake/admin/activity`** | Live feed of every edit on the site | 2 min |

That's it. Skip below for what each one shows and how to triage.

---

## 1. THE INBOX — `/intake/admin/inbox`

🔗 **https://futures-church.netlify.app/intake/admin/inbox**

This is where visitor messages land when someone fills in:

| Form | Where it lives | What visitor wants |
|---|---|---|
| **Contact** | `/contact` | General questions, comments, "I want to talk to a pastor" |
| **Plan a visit** | `/plan-a-visit` | "I'm thinking about coming on Sunday — help me know what to expect" |
| **Prayer request** | `/prayer` | "Please pray for ___" |
| **Press / partnership** | `/press`, `/connect` | Media, ministry partnership inquiries |

Every submission shows up in your inbox with:
- Visitor's name + email + (sometimes) phone
- Which form they used
- Their message
- Which campus they're closest to (auto-detected from their browser geolocation if they allowed it)
- Timestamp

---

### How to triage the inbox

For each new message, ask: **who needs to see this?**

| Message type | Who you forward to | Action |
|---|---|---|
| **Prayer request** for [Campus X] | The lead pastor of [Campus X] | Forward, write "I'll cover this until you reply" |
| **Plan a visit** for [Campus X] | [Campus X] pastor + their connections lead | Forward, set expectation: "Pastor [name] will text you within 24h" |
| **Contact / general** about doctrine, theology, big questions | Ashley (or Pastor Jane) | Forward, mark "needs senior response" |
| **Press / partnership** | Ashley | Forward |
| **Spam / abuse / harassment** | Mark as resolved/archive | Don't reply. Flag to Ashley if pattern emerges. |

**Aim:** every message gets a response (from someone) within 24 hours. Even if it's "we got your message, [pastor name] will be in touch this week."

---

### How to mark a message as handled

Once you've forwarded it / responded, click the message and mark it **resolved** (or "archive" — same thing). It moves out of your active inbox so you can see what's still pending.

If you can't tell who should handle it, **leave it pending and ask Ashley.** Don't delete.

---

### Daily inbox rhythm

- **Morning** *(7-min coffee window)* — open inbox, triage anything new from overnight
- **Late afternoon** *(quick pre-end-of-day skim)* — anything that came in during the day, route before going home

If the inbox empty all morning → great, no one's stuck.
If the inbox has 20 new messages → text Ashley. Could be a campaign hit or an unusual day; we may need a system response.

---

## 2. THE ACTIVITY FEED — `/intake/admin/activity`

🔗 **https://futures-church.netlify.app/intake/admin/activity**

This is a live, chronological feed of **every edit happening across the site** — yours, the 21 pastors', anyone with editor access. Each entry shows:

- **Who** (the editor's name)
- **What** (slot name, e.g., "Paradise → Distinctive paragraph")
- **When** (timestamp)
- **Before / After** (the actual text change)

It's a paranoid-but-healthy feed. You're not auditing for blame; you're watching for **anomalies** that suggest something is off.

---

### What's normal

- A pastor making 5–10 edits in a 30-minute burst, then going quiet → totally normal, that's a Sunday-afternoon writing session
- Edits trickling in evenings, weekends → normal
- Multiple campuses editing in parallel → normal
- Photo additions appearing in pools → normal

---

### What's worth a closer look

Skim the feed once a day for these signals:

| Signal | What it might mean | What you do |
|---|---|---|
| **The same slot edited 8+ times in 30 minutes by 3 different people** | Two writers fighting / overwriting each other | Text the campus pastor: "Who's your point person this week?" |
| **Text suddenly says "test" or "lorem ipsum" or all-caps "TESTING"** | Someone stress-testing the editor | Reach out, confirm intent |
| **A previously-written 200-word paragraph replaced with 5 words** | Either intentional revision or accidental delete | Click into the activity entry, see the before/after, decide if you need to restore |
| **Profanity, hostile content, names of specific individuals** | Something has gone wrong — angry pastor, hacked account, etc. | Revert immediately *(copy the "before" text, paste it back)*. Then text Ashley. |
| **Edits from a name you don't recognise** | A pastor's writer/delegate, or possibly a session leak | Ping the pastor: "Is [name] writing for you?" |

**You're not a security guard.** You're more like a barn owner who walks the perimeter. Most days you see nothing. Once a week you spot something to gently follow up.

---

### Reverting an edit

If you see something on the activity feed that needs to be undone:

1. Click into the activity entry
2. The "before" value is shown
3. Copy it
4. Click "Go to slot" or use the slot's URL to navigate to where it lives
5. Toggle edit mode on
6. Click the slot's dashed box, paste the old value, save

If you can't find the "before" or it's complicated, **text Ashley.** Don't try to reconstruct from memory.

---

### Daily activity-feed rhythm

- **Once a day** *(end of morning email triage works well)* — skim the last 24 hours of activity. 1–2 minutes. Look for the signals above.

That's it. You don't read every edit. You just scan for the unusual.

---

## When the inbox or activity feed is silent

If a whole day passes with **zero inbox messages and zero edits** — that's a signal:

- **Day 1–2:** normal, pastors haven't received the email yet
- **Day 3–6:** worth a single nudge in your team chat: "Has everyone gotten started?"
- **Day 7+ silent:** something is broken. Test the system yourself (try editing one slot — does it save?). If it works, the problem is human (no one's actually doing it). If it doesn't, text Ashley.

---

## A note on email forwarding

When you forward an inbox message to a pastor, the easiest workflow:

1. Copy the visitor's name + email + message into a clean email to the pastor
2. Add one sentence of context: *"Forwarding from the contact form on the new website. Visitor wants to plan a visit. Reply directly to them."*
3. **CC Ashley** if it's the first month — gives Ashley a feel for what's coming in and whether the routing is working

After Month 1, drop the CC unless something is unusual.

---

**Next doc:** `JOSH-6-WHEN-STUCK.md` — what to do when the system breaks.
