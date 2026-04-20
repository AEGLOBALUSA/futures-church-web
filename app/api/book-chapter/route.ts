import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/providers/email";
import { pushToCRM } from "@/lib/providers/crm";
import { books } from "@/lib/content/books";

export const runtime = "nodejs";

type BookChapterPayload = {
  bookSlug: string;
  email: string;
  name?: string;
};

export async function POST(req: Request) {
  let body: BookChapterPayload;
  try {
    body = (await req.json()) as BookChapterPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (!body.bookSlug || !body.email) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  const book = books.find((b) => b.id === body.bookSlug);
  if (!book) {
    return NextResponse.json({ ok: false, error: "unknown-book" }, { status: 404 });
  }

  await pushToCRM({
    source: `book-chapter-${book.id}`,
    lifecycle: "reader",
    data: { bookId: book.id, bookTitle: book.title, email: body.email, name: body.name },
  });

  const template = book.status === "coming-soon" ? "book-coming-soon" : "book-chapter";
  await sendEmail({
    template,
    to: body.email,
    subject: book.status === "coming-soon" ? `${book.title} \u2014 you\u2019re on the list.` : `Chapter 1 of ${book.title}.`,
    data: { bookTitle: book.title, author: book.author, firstName: body.name?.split(" ")[0] ?? "friend" },
  });

  return NextResponse.json({ ok: true, status: book.status });
}
