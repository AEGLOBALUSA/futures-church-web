export type BookStatus = "available" | "coming-soon";
export type BookCategory = "leadership" | "personal" | "family";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  category: BookCategory;
  description: string;
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
    description: "A bold call to live without the limits that fear places on your life, your faith, and your future. Ashley writes from experience — the kind that only comes from walking through the thing you were most afraid of.",
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
    description: "Your breakthrough is not waiting on your circumstances — it's waiting on your faith. Ashley unpacks the biblical principles of supernatural provision and teaches you how to move from lack into abundance.",
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
    description: "Honest, warm, and genuinely helpful — Jane Evans writes for the mother who loves her kids more than anything and still wonders if she's doing it right. Spoiler: you are. But this book will help you do it even better.",
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
    description: "The book the church needs to read. Ashley makes the unignorable case: a church that isn't multiplying is slowly dying. This is the playbook for leaders who refuse to settle for maintenance.",
    cover: "/images/book-multiply-or-die.jpg",
  },
  {
    id: "whats-wrong-with-the-church",
    title: "What's Wrong with the Church",
    author: "Ashley Evans",
    status: "coming-soon",
    category: "leadership",
    description: "Ashley names what most leaders won't say out loud — and then points the way forward. Not a critique. A conviction. A call to become everything the church was always meant to be.",
    cover: "/images/book-whats-wrong.jpg",
  },
];
