import type { Metadata } from "next";
import { BooksPageClient } from "@/components/action/BooksPageClient";
import { SlotProvider } from "@/components/edit/SlotProvider";
import { getSlotsForPage } from "@/lib/content/slots/server";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books from Ashley and Jane Evans. Read a free chapter, grab a study guide, or lock in the next release.",
};

export default async function BooksPage() {
  const slots = await getSlotsForPage("/books");
  return (
    <SlotProvider initialValues={slots}>
      <BooksPageClient />
    </SlotProvider>
  );
}
