# JOSH — IN-SITE EDITING

**How to edit any text or photo, on any page, by clicking it**

*Read after `JOSH-2-MASTER-EDIT-LIST.md`. 5 minutes.*

---

## The simple version

After you log in once at `/intake/admin/login` with `FCADMIN`:

1. Go to **any page** on the site (e.g., `https://futures-church.netlify.app/kids`)
2. **Toggle edit mode on** (look for an "Edit" pill in the corner of the screen)
3. **Dashed boxes appear** around every editable element on the page
4. **Click a box** to edit
5. **Type** — autosaves after 2 seconds of you stopping
6. Move on. Done.

There is no "save" button. There is no "publish" button. **The moment you stop typing for 2 seconds, your edit is live.**

---

## Where to log in (one more time, in case you forgot)

| | |
|---|---|
| **URL** | https://futures-church.netlify.app/intake/admin/login |
| **Password** | `FCADMIN` (all caps) |
| **Lasts** | 30 days |

Once logged in, **the same login works on every page on the site for editing.** You don't re-log-in per page.

---

## How edit mode looks (visual description)

When edit mode is **off** (default after login):
- The site looks normal to you — same as any visitor sees
- No dashed boxes
- You can navigate around freely

When edit mode is **on** (after toggling):
- Dashed warm-toned boxes appear around every editable text and photo
- Hover over a box → it pulses gently to invite a click
- A small badge in the corner of each box shows: who owns this slot + what slot name it is
- You see the same content visitors see, just with the editing affordances overlaid

**Toggle it on** by looking for a small pill or button in the corner of the screen (top-right or bottom-right). It says "Edit" or has an edit icon. When you click it, the dashed boxes appear.

**Toggle it off** by clicking the same pill again. Dashed boxes disappear and the site returns to its normal visitor view.

---

## What kinds of things have dashed boxes

| Type | Examples |
|---|---|
| **Headlines** | The big text at the top of each page |
| **Paragraphs** | Body copy describing what something is |
| **Service times** | Like "Sunday 9am & 11am" on a campus page |
| **Pastor names** | The "led by ____ & ____" lines |
| **Photos** | Pastor portraits, hero photos, campus shots |
| **Quotes / testimonials** | The "[someone] said ___" boxes |

Things that **do NOT** have dashed boxes (you can't edit them this way):
- Navigation menu items (those are structural — tell Ashley if a nav link needs changing)
- Footer
- Form labels
- Buttons / calls to action

If you think something should be editable but doesn't have a dashed box → text Ashley. We can add it.

---

## The full step-by-step for editing one slot

Let's walk through editing the Kids page program description as an example.

### Step 1 — Get there
Go to https://futures-church.netlify.app/kids

### Step 2 — Toggle edit mode
Look for the small "Edit" pill (top-right or bottom-right corner of the screen). Click it. The page now shows dashed boxes around every editable element.

### Step 3 — Find the slot
Scroll to the program description paragraph. It will have a dashed warm box around it. The badge in the corner says something like:
> *Josh Greenwood (or appointee) · Program description*

This tells you: this slot is yours, named "Program description."

### Step 4 — Click the box
The box becomes a text input. The text inside becomes editable.

### Step 5 — Type
Write your paragraph. Aim for 60–90 words (the budget shown on the coverage dashboard).

### Step 6 — Stop typing
The moment you stop typing for ~2 seconds, you'll see a small "saved" indicator appear (usually near the box or in the corner). That's the autosave confirmation.

### Step 7 — Verify
- Click somewhere else on the page (the box "deselects")
- Reload the page (Cmd+Shift+R or Ctrl+Shift+R)
- Your text is still there → confirmed live

That's the entire flow. **Steps 4–7 take about 60 seconds per slot.**

---

## What the "saved" indicator looks like

After you stop typing, you'll see one of these:

| What you see | What it means |
|---|---|
| **"Saved · just now"** *(green tint)* | All good. Live on the site. |
| **"Saving..."** *(amber)* | In progress, wait 1–2 seconds |
| **"Save failed — retry"** *(red)* | Network hiccup. Click retry. If it keeps failing, see `JOSH-6-WHEN-STUCK.md`. |

If you DON'T see any "saved" indicator after typing — **assume your edit didn't save**. Reload the page and check. If your text is gone, retry. If it keeps not saving, text Ashley.

---

## Common mistakes to avoid

### ❌ Don't paste from Word with formatting
Word's hidden formatting characters can break the layout. **Paste as plain text** (Cmd+Shift+V on Mac, Ctrl+Shift+V on Windows). Or paste into a plain text editor first, then re-copy.

### ❌ Don't use ALL CAPS for emphasis
The site has its own typography rules. ALL CAPS will look shouty and out-of-place. If you want emphasis, just write the sentence well.

### ❌ Don't write "click here" or "see below"
Visitors might be on mobile, or might have arrived from a search result deep-linked to a paragraph. Write so each paragraph stands alone.

### ❌ Don't overthink it
First pass: write something honest in your voice. Second pass next week: refine. **Done is better than perfect.**

---

## Editing photos

Photos work slightly differently from text. The dashed box around a photo gives you two options:

- **Replace this photo** → upload a new image from your computer
- **Pick from pool** → choose from photos that pastors have uploaded to that campus's pool

For details on how the photo system works, who uploads what, and how to curate the right photo to the right slot, see `JOSH-4-PHOTOS.md`.

---

## What if you make a mistake

Three options:

1. **Just edit it again** — type the correct version. The autosave overwrites.
2. **Check the activity feed** — `/intake/admin/activity` shows the previous value. Copy it back manually.
3. **Text Ashley** — if you can't recover what was there, Ashley can pull from a backup.

There's no "undo" button. But the system is forgiving. Just type again.

---

## Mobile editing — works but isn't great

The dashed boxes work on mobile, but the keyboards are awkward and the typography preview can lie about line breaks. **Don't write substantive paragraphs on a phone.** Use a laptop. Phones are fine for spotting typos and quick word changes.

---

## When to log out

You don't need to log out daily. Your session lasts 30 days. **But if you're handing the laptop to someone else** (your writer, a guest), log out so they don't accidentally edit something with your name attached.

To log out:
- Go to `/intake/admin` and look for "Sign out" in the corner
- OR clear cookies for the site

---

## A note on who appears as the editor

When you save an edit, the activity feed records *Josh Greenwood (or whatever name you set in your editor profile) edited Kids → Program description at 2:14pm*.

When you first save an edit, the system might prompt you for **"Your name (for the activity log)"** — type "Josh Greenwood" or whatever you want shown. This persists and is used for all your future edits.

If a writer is editing on your behalf, have them put their own name there (e.g., "Sam Tully — Josh's writer"). It helps Ashley know who actually wrote what when reviewing.

---

**Next doc:** `JOSH-4-PHOTOS.md` — how the campus photo pools and curator work.
