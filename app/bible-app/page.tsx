import type { Metadata } from "next";
import { BibleAppPageClient } from "@/components/action/BibleAppPageClient";

export const metadata: Metadata = {
  title: "Bible App",
  description:
    "Futures Bible \u2014 Read. Listen. Pause. A Bible app with Selah\u2019s stillness baked in. Free on iOS and Android.",
};

export default function BibleAppPage() {
  return <BibleAppPageClient />;
}
