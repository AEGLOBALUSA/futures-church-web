"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Quote } from "lucide-react";

// Full names + locations + portraits.
// Portraits hotlinked from Unsplash (free, royalty-free). Swap for real Futures photos later.
type Person = {
  name: string;      // real-sounding full names (made up for now per the team's ask)
  role: string;      // campus / volunteer / pastor designation
  photo: string;     // Unsplash URL
  accent: string;    // warm hue for frame
  quote: string;
};

const PEOPLE: Person[] = [
  {
    name: "Maya Henderson",
    role: "new to Paradise",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop",
    accent: "#C8906B",
    quote:
      "I came in carrying more than I knew. By the third Sunday, three women knew my name and my hard week.",
  },
  {
    name: "Ps. Josh Greenwood",
    role: "Australia Lead · Paradise",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80&auto=format&fit=crop",
    accent: "#AC9B25",
    quote:
      "My job isn't to perform a service. It's to make sure every person in the room knows they were expected.",
  },
  {
    name: "Aïcha Diallo",
    role: "Adelaide City",
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80&auto=format&fit=crop",
    accent: "#C45236",
    quote:
      "I almost didn't walk in. The volunteer at the door looked me in the eye like she'd been waiting for me. Maybe she had.",
  },
  {
    name: "Kai Tupou",
    role: "Online Church · Auckland",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
    accent: "#8A5A3C",
    quote:
      "I live three time zones away from any campus. I still feel like I belong to a room full of people.",
  },
  {
    name: "Lina Morales",
    role: "Caracas · launching",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop",
    accent: "#D9B089",
    quote:
      "Mi familia llegó con nada. Aquí adoramos en nuestro idioma, y nuestros hijos aprenden en el suyo.",
  },
  {
    name: "Ps. Theo Williams",
    role: "Los Angeles · Kids team",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop",
    accent: "#765020",
    quote:
      "Sundays are the safest, loudest, most fun two hours of the week for our kids. That's the standard.",
  },
  {
    name: "Kadek Wirawan",
    role: "Bali · Denpasar",
    photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80&auto=format&fit=crop",
    accent: "#C8906B",
    quote:
      "Sunrise prayer changed how I lead my team all week. Quiet before loud.",
  },
  {
    name: "Rubén Castillo",
    role: "Maracaibo · launching",
    photo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
    accent: "#AC9B25",
    quote:
      "I walked in heartbroken. A year later — a wife, a calling, a chosen family.",
  },
];

export function PeopleGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-8%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32 sm:py-40"
      style={{ background: "#F7F1E6" }}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p
            className="font-sans"
            style={{
              color: "#534D44",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            The people
          </p>
          <h2
            className="mt-4 font-display max-w-[18ch]"
            style={{
              color: "#1C1A17",
              fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
              lineHeight: 1.05,
              fontWeight: 300,
            }}
          >
            Real people. Real campuses. Real stories.
          </h2>
          <p
            className="mt-5 max-w-[46ch] font-sans"
            style={{ color: "#534D44", fontSize: 17, lineHeight: 1.6 }}
          >
            Not marketing. Moments. Eight voices from eight campuses — first-time visitors, campus pastors, kids team volunteers, people who walked in lost and walked out home.
          </p>
          <p className="mt-3 font-display italic" style={{ color: "#8A8178", fontSize: 13 }}>
            Hover any face to hear their moment.
          </p>
        </motion.div>

        <motion.div style={{ x }} className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PEOPLE.map((p, i) => (
            <PersonCard key={p.name} person={p} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PersonCard({ person, index }: { person: Person; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 80, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 80, damping: 14 });

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  return (
    <motion.figure
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className="group cursor-pointer"
    >
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px]"
        style={{
          background: person.accent,
          boxShadow: hovered
            ? "0 32px 60px -22px rgba(20,20,20,0.4)"
            : "0 18px 40px -18px rgba(20,20,20,0.28)",
          transition: "box-shadow 400ms cubic-bezier(0.25,0.1,0.25,1)",
        }}
      >
        <Image
          src={person.photo}
          alt={`${person.name} — ${person.role}`}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          unoptimized
        />
        {/* Color-film wash for cohesion across different portrait sources */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light transition-opacity duration-500"
          style={{ background: person.accent, opacity: hovered ? 0.15 : 0.3 }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, transparent 45%, rgba(28,26,23,0.72) 100%)" }}
        />

        {/* Quote reveal on hover */}
        <div
          className="absolute inset-0 flex items-end p-5 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div
            className="relative w-full rounded-2xl p-4"
            style={{
              background: "rgba(253,251,246,0.94)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 12px 24px -10px rgba(20,20,20,0.3)",
            }}
          >
            <Quote
              className="absolute -top-2 -left-1 h-4 w-4"
              strokeWidth={2}
              style={{ color: person.accent }}
            />
            <p
              className="font-display italic leading-snug"
              style={{ color: "#1C1A17", fontSize: 14, fontWeight: 300 }}
            >
              {person.quote}
            </p>
          </div>
        </div>

        {/* Resting caption */}
        <div
          className="absolute bottom-5 left-5 right-5 transition-opacity duration-500"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          <p
            className="font-sans"
            style={{
              color: "rgba(253,251,246,0.75)",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {person.role}
          </p>
          <p className="mt-1 font-display italic" style={{ color: "#FDFBF6", fontSize: 22, fontWeight: 300 }}>
            {person.name}
          </p>
        </div>
      </div>
      <figcaption className="mt-4 flex items-baseline gap-2">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: person.accent }}
        />
        <span className="font-sans" style={{ color: "#534D44", fontSize: 13 }}>
          {person.role}
        </span>
      </figcaption>
    </motion.figure>
  );
}
