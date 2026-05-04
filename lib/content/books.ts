// SOURCE OF TRUTH for every Futures-published book on the public site AND
// inside Milo's knowledge. When the public /books description and Milo's
// answer must agree, both come from THIS file.
//
//   description  → long marketing copy for the public /books page only.
//   miloTheme    → author-approved one-line theme. Milo MUST use this
//                  verbatim. NEVER paraphrase. NEVER substitute themes
//                  inferred from the title.
//
// Adding/changing a book? Edit this file, push, redeploy. Both surfaces
// update at once.

export type BookStatus = "available" | "coming-soon";
export type BookCategory = "leadership" | "personal" | "family";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  category: BookCategory;
  description: string;
  /**
   * Author-approved short theme line, used by Milo verbatim.
   * Format: "on <topic>" — e.g. "on grace", "on overcoming fear and anxiety".
   * Keep it short and unambiguous. Do not infer from the title.
   */
  miloTheme: string;
  isbn?: string;
  asin?: string;
  buyUrl?: string;
  cover: string;
  year?: number;
}

export const books: Book[] = [
  {
    id: "no-more-fear",
    title: "No More Fear",
    author: "Ashley Evans",
    status: "available",
    category: "personal",
    description:
      "A bold call to live without the limits that fear places on your life, your faith, and your future. Ashley writes from experience — the kind that only comes from walking through the thing you were most afraid of.",
    miloTheme: "on overcoming fear and anxiety",
    isbn: "9781936699988",
    buyUrl: "https://amazon.com/dp/1936699982",
    cover: "/images/book-no-more-fear.jpg",
    year: 2012,
  },
  {
    id: "scarcity-to-supply",
    title: "From Scarcity to Supernatural Supply",
    author: "Ashley Evans",
    status: "available",
    category: "personal",
    // This book is on GRACE. Despite the title, it is NOT a teaching on
    // money, finances, or prosperity. Marketing copy below was rewritten
    // to remove the prior money-framing — review and refine if needed.
    description:
      "A book on grace. Ashley unpacks how breakthrough begins with grace received, not effort spent — and what changes when grace, not striving, becomes the ground you stand on.",
    miloTheme: "on grace",
    asin: "B0FX3FBBKB",
    buyUrl: "https://amazon.com/dp/B0FX3FBBKB",
    cover: "/images/book-scarcity-to-supply.jpg",
  },
  {
    id: "help-im-a-mother",
    title: "Help I'm A Mother!",
    author: "Jane Evans",
    status: "available",
    category: "family",
    description:
      "Honest, warm, and genuinely helpful — Jane Evans writes for the mother who loves her kids more than anything and still wonders if she's doing it right. Spoiler: you are. But this book will help you do it even better.",
    miloTheme: "on parenting and motherhood",
    isbn: "9780975765708",
    buyUrl: "https://amazon.com/s?k=Help+Im+A+Mother+Jane+Evans",
    cover: "/images/book-help-im-a-mother.jpg",
    year: 2005,
  },
  {
    id: "multiply-or-die",
    title: "Multiply or Die",
    author: "Ashley Evans",
    status: "coming-soon",
    category: "leadership",
    description:
      "The book the church needs to read. Ashley makes the unignorable case: a church that isn't multiplying is slowly dying. This is the playbook for leaders who refuse to settle for maintenance.",
    miloTheme: "on multiplication and the local church",
    cover: "/images/book-multiply-or-die.jpg",
  },
  {
    id: "whats-wrong-with-the-church",
    title: "What's Wrong with the Church",
    author: "Ashley Evans",
    status: "coming-soon",
    category: "leadership",
    description:
      "Ashley names what most leaders won't say out loud — and then points the way forward. Not a critique. A conviction. A call to become everything the church was always meant to be.",
    miloTheme: "on what's wrong with today's church and how it can be made right",
    cover: "/images/book-whats-wrong.jpg",
  },
];
