import type { Metadata } from "next";
import { BooksPageClient } from "@/components/action/BooksPageClient";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books from Ashley and Jane Evans. Read a free chapter, grab a study guide, or lock in the next release.",
};

export default function BooksPage() {
  return <BooksPageClient />;
}
