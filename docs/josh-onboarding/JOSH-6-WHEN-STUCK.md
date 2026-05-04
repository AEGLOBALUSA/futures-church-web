# JOSH — WHEN STUCK

**Troubleshooting and escalation**

*Read after `JOSH-5-DAILY-CHECKINS.md`. 5 minutes. Bookmark it.*

---

## The first rule

**You don't fix anything technical yourself.** You spot the problem, capture the right details, and text Ashley. That's it. The system has been engineered to be repaired by Ashley (or her builder) in 5–30 minutes once flagged.

What you DO need to do:
- **Confirm the problem is real** *(reload, try a different browser, try a different network)*
- **Capture details** *(URL, screenshot, what you were doing, what you expected)*
- **Text Ashley with one tight message**

---

## The "is this real?" 30-second check

Before you escalate, do this:

1. **Cmd+Shift+R** *(or Ctrl+Shift+R on Windows)* — hard reload, bypasses cache
2. **Try a private/incognito window** — rules out browser extensions
3. **Try a different network** — phone hotspot, etc.
4. **Try a different device** — your phone if you were on laptop

If the problem persists across all of those, **it's real. Escalate.**
If it goes away in incognito or on a different network, **it's local to you.** Less urgent. Note it but you can probably keep working.

---

## The most common 8 problems and what to do

### 1. "I can't log in"

**Symptoms:** You enter `FCADMIN` and the form says "wrong password" or just spins.

**First try:**
- Make sure you're typing **all capital letters**, no spaces
- Try copy-pasting from this doc (no autocorrect risk)
- Hard reload the login page

**If still broken:** Text Ashley:
> *"Login failing on /intake/admin/login with FCADMIN. Browser: Chrome on Mac. Tried hard reload + incognito."*

---

### 2. "A page is 404'ing"

**Symptoms:** You go to a URL and get "Page not found."

**First check:**
- Did you type the URL correctly? (e.g., `/campuses/paradise` not `/campus/paradise`)
- Is it a campus that hasn't been seeded yet? (Some campuses might be in the system as a "region" but no actual campus page exists.)

**If the URL is right and the campus is real:** Text Ashley:
> *"https://futures-church.netlify.app/[URL] is 404'ing. I expect it to render the [Campus X] page."*

---

### 3. "An edit won't save"

**Symptoms:** You click a dashed box, type, but no "saved" indicator appears. Or you see "save failed — retry" and the retry doesn't work.

**First try:**
- Check internet connection
- Refresh the page — your text might have actually saved despite the missing indicator
- Try editing a different slot — is it just this one slot or all of them?

**If only this one slot:** Text Ashley:
> *"Slot [name] on /[page] won't save. I see [save failed / no indicator]. All other slots on the same page save fine."*

**If ALL slots are failing:** This is more serious. Text Ashley immediately:
> *"Editing system is down — no slots are saving on any page. Last verified working at [time]."*

---

### 4. "A pastor's link doesn't work"

**Symptoms:** A pastor texts you saying "I clicked the link and it just shows a login screen / 404 / not-authorized error."

**First check:**
- Did you give them the right link from the CSV? Re-check: `/tmp/futures-intake-tokens-2026-05-04.csv`, find their row, look at the `intake_link` column
- Has the link been used before? *(Some token systems have one-shot tokens. Once used to mint the editor session, the URL itself stops working — but the cookie they got is still valid.)*

**If the link is correct and they say it never worked:** Re-issue from `/intake/admin/seed`:
1. Go to `https://futures-church.netlify.app/intake/admin/seed`
2. Find the pastor's campus
3. Click "Re-issue link"
4. Copy the new URL and send it to them

**If you can't find the campus or the seed page is acting weird:** Text Ashley:
> *"[Pastor Name]'s link for [Campus X] isn't working. Tried re-issuing from /intake/admin/seed but [what happened]."*

---

### 5. "The site looks weird / broken layout"

**Symptoms:** A page is missing photos, has overlapping text, or just doesn't look right.

**First try:**
- Hard reload (Cmd+Shift+R)
- Try in incognito
- Try on your phone — sometimes the desktop layout has an issue the mobile view doesn't

**If the page is genuinely broken visually:** Screenshot it and text Ashley:
> *"[URL] looks broken — [describe]. Screenshot attached."*

---

### 6. "I don't see the dashed boxes when in edit mode"

**Symptoms:** You're logged in, you click the "Edit" pill, but no dashed boxes appear.

**First try:**
- Hard reload
- Confirm you're logged in (visit `/intake/admin` — does it load the dashboard, or send you back to login?)
- Try a different page (some pages might have fewer editable slots than others — try `/kids` which definitely has multiple)

**If no dashed boxes anywhere:** Text Ashley:
> *"Edit mode toggling on but no dashed boxes appearing on any page. Logged in, confirmed I can reach /intake/admin."*

---

### 7. "Photo upload failing"

**Symptoms:** A pastor (or you) tries to upload a photo and gets an error, or the upload spinner just keeps spinning.

**First check:**
- File size — anything over 50MB might fail. Have them resize.
- File format — JPEG, PNG, HEIC, WebP all work. RAW files (CR2, NEF, etc.) don't.
- Network — are they on slow wifi?

**If the file is reasonable and the upload still fails:** Text Ashley:
> *"Photo upload failing for [Campus X]. File: [name, size, format]. Error message: [what they saw]."*

---

### 8. "Milo (the AI guide) is broken"

**Symptoms:** A visitor (or you) clicks the "Ask Milo" pill, types a question, and gets no response, or gets a generic error.

**First check:**
- Try a different question — maybe just that one question hit a content filter
- Refresh the page

**If Milo is silent on every question:** Text Ashley:
> *"Milo not responding on any question I try. URL: [where you tested]. Time: [now]."*

*(Likely cause: API quota issue. Quick fix on Ashley's side.)*

---

## What to do when you genuinely don't know what's wrong

If something is "off" but you can't pinpoint it — **describe what you see, not what you think the problem is.**

Bad message: *"The site is broken."*
Good message: *"On /campuses/paradise, the hero photo is missing and the 'Plan a visit' button takes me to a 404. Tested in Chrome and Safari. Both broken the same way."*

Specific descriptions get fixed in 5 minutes. Vague ones cost an hour of back-and-forth.

---

## Escalation chain

| Severity | Examples | Who to text | Expected response |
|---|---|---|---|
| **🟢 Minor** | Typo in a UI label, a confusing tooltip, a slot you wish was editable but isn't | Ashley | Within 24h |
| **🟡 Medium** | One pastor's link doesn't work, one slot isn't saving, a single page looks broken | Ashley | Within 4h |
| **🔴 Major** | Login is down, no slots are saving site-wide, the homepage 500s, a campus page shows offensive content | Ashley | Immediately, by phone if no text reply in 15 min |

For 🔴, **don't wait.** A 30-second voice memo is worth more than a perfect text. Ashley would rather get a wrong-alarm-it-was-fine call than miss a real outage.

---

## What NOT to do

- ❌ Don't try to "fix" the code yourself or have someone else "look at it"
- ❌ Don't delete things to "clean up" — once gone, recovery is annoying
- ❌ Don't share your `FCADMIN` password with anyone you wouldn't trust to edit anywhere on the site (your writer is fine; your kid is not)
- ❌ Don't post screenshots of admin dashboards on social media — they show pastor names, message contents, etc.
- ❌ Don't reply to angry visitor messages from your inbox account — those need to go to the right pastor first

---

## Things you can fix yourself (no Ashley needed)

These you handle without escalating:

- ✅ A typo you made in a slot — just edit it again
- ✅ A photo you assigned to the wrong slot — re-assign in the photo curator
- ✅ A pastor who needs their link re-sent — pull from CSV, re-send. *(If the link itself is broken, escalate.)*
- ✅ A visitor message that needs forwarding — forward to the right pastor, mark as resolved
- ✅ Your own login session expired — just re-log-in with `FCADMIN`
- ✅ A pastor asking "where do I click?" — send them the walkthrough video link from `02-walkthrough-script.md`

---

## A cheat sheet for the text-Ashley message

Always include:
1. **What URL** *(exact link)*
2. **What you did** *(I clicked X, typed Y)*
3. **What you expected** *(I expected Z to happen)*
4. **What actually happened** *(but instead, W happened)*
5. **What you tried** *(I hard reloaded, tried incognito, tried Safari)*
6. **Browser + device** *(Chrome on Mac, Safari on iPhone, etc.)*

Example:
> *"Hey — login is failing for me at https://futures-church.netlify.app/intake/admin/login. I'm typing FCADMIN (all caps), expecting to land at /intake/admin. Instead the form says 'wrong password' and stays on the login screen. Tried hard reload, incognito, and a different network — same result. Chrome on Mac. Just started 10 minutes ago."*

That message gets fixed in 5 minutes.

---

## You're going to be fine

The system is forgiving. Most "problems" are 30-second fixes (cache, reload, retype). Real breakages are rare and Ashley is on call. Trust your eyes, capture details, escalate cleanly.

The 21 campuses are watching this site come together. You're the conductor.

— A
