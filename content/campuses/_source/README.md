# Campus Voice — Source of Truth

Every campus page on futures-church.netlify.app reads from `lib/content/campus-voices.ts`. The values in that file are copied from the per-campus markdown files in this folder, once pastors have returned their answers.

## Workflow

1. **Questionnaire goes out.** [`QUESTIONNAIRE.md`](./QUESTIONNAIRE.md) is the single-source doc sent to every Lead Pastor.
2. **Pastor fills in a copy.** Saved here as `<slug>.md` — e.g. `paradise.md`, `gwinnett.md`, `bali.md`.
3. **Content team lifts the answers** into `lib/content/campus-voices.ts` under the matching slug key.
4. **Deploy.** The PendingNote placeholder disappears and the pastor's voice lands on the live page.

## Status

Check which campuses still owe answers:

```ts
import { pendingFields } from "@/lib/content/campus-voices";
pendingFields("paradise"); // ["whatToExpect", "specifics", "firstTimeLine", "pastorBio", "kidsBlock"]
```

If all fields are empty for a slug, the live campus page renders dashed "awaiting pastor voice" cards in every voice-driven section. Visible to visitors. Impossible to miss during QA.

## Pilots

Prompt 02 ("Give each campus its own voice") lands real copy for three pilots first — **Paradise**, **Bali**, **Gwinnett** — so we can prove the difference side-by-side before rolling to all 25.
