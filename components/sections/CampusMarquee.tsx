import { Marquee } from "@/components/motion/Marquee";
import { campuses } from "@/lib/content/campuses";
import { MapPin } from "lucide-react";

const activeCampuses = campuses.filter((c) => c.status === "active" || c.status === "online");

export function CampusMarquee() {
  return (
    <section className="py-20 md:py-24 bg-obsidian-900 overflow-hidden border-y border-bone/5">
      <div className="flex items-center justify-center gap-3 mb-10 px-6">
        <span className="w-1.5 h-1.5 rounded-full bg-sky pulse-dot" />
        <p className="section-label text-bone/70">21 CAMPUSES · 5 NATIONS · 1 FAMILY</p>
      </div>
      <Marquee>
        {activeCampuses.map((campus) => (
          <div
            key={campus.slug}
            className="flex items-center gap-2 bg-obsidian-800 border border-bone/10 rounded-full px-5 py-2.5 whitespace-nowrap hover:border-lemon/60 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-lemon flex-shrink-0" strokeWidth={1.5} />
            <span className="font-sans text-sm text-bone font-medium">{campus.name}</span>
            <span className="text-bone/30 text-xs">·</span>
            <span className="font-sans text-xs text-bone/60">{campus.city}</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
