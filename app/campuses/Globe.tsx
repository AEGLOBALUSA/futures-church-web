"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { campuses, regions, type Campus } from "@/lib/content/campuses";

// Flagship campuses read slightly larger; launching Venezuela campuses smaller.
const FLAGSHIP_SLUGS = new Set(["paradise", "gwinnett"]);
const LAUNCHING_SIZE = 0.04;
const FLAGSHIP_SIZE = 0.09;
const DEFAULT_SIZE = 0.06;

function markerSize(slug: string, status: string) {
  if (FLAGSHIP_SLUGS.has(slug)) return FLAGSHIP_SIZE;
  if (status === "launching") return LAUNCHING_SIZE;
  return DEFAULT_SIZE;
}

// Port of cobe's lat/lng → 3D unit-sphere projection (see cobe U() in source).
function latLngTo3D(lat: number, lng: number): [number, number, number] {
  const r = (lat * Math.PI) / 180;
  const a = (lng * Math.PI) / 180 - Math.PI;
  const o = Math.cos(r);
  return [-o * Math.cos(a), Math.sin(r), o * Math.sin(a)];
}

// Given a target (lat, lng) and current phi/theta, return the phi/theta
// values that center that point in the viewport (derived from cobe's
// rotation matrix). See chat notes for derivation.
function focusPhiTheta(lat: number, lng: number) {
  const theta = (lat * Math.PI) / 180;
  // phi_target = 3π/2 − lng_rad, mod 2π.
  let phi = (3 * Math.PI) / 2 - (lng * Math.PI) / 180;
  phi = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return { phi, theta };
}

function shortestPhiDelta(from: number, to: number) {
  // Return the shortest signed rotation from `from` to `to`, accounting
  // for cobe's unbounded phi accumulation.
  const twoPi = 2 * Math.PI;
  const raw = (to - from) % twoPi;
  return ((raw + Math.PI * 3) % twoPi) - Math.PI;
}

type GlobeProps = {
  onCampusClick?: (slug: string) => void;
  /** Target (lat, lng) for camera. When set, the globe animates to center it. */
  focus?: { lat: number; lng: number } | null;
  /** 1 = default, <1 = shrink toward a corner (country/campus view). */
  scale?: number;
};

type Marker = {
  campus: Campus;
  pos: [number, number, number]; // 3D unit-sphere position, pre-rotation
  size: number;
};

export default function Globe({ onCampusClick, focus, scale = 1 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.25);
  const focusRef = useRef<{ phi: number; theta: number } | null>(null);
  const scaleRef = useRef(scale);

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Rebuild focus target whenever the prop changes.
  useEffect(() => {
    if (focus) {
      focusRef.current = focusPhiTheta(focus.lat, focus.lng);
    } else {
      focusRef.current = null;
    }
  }, [focus]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    if (!canvasRef.current || reducedMotion) return;
    const canvas = canvasRef.current;

    let width = canvas.offsetWidth || 1;
    const onResize = () => {
      width = canvas.offsetWidth || 1;
    };
    window.addEventListener("resize", onResize);

    const markerList: Marker[] = campuses
      .filter((c) => typeof c.lat === "number" && typeof c.lng === "number")
      .map((c) => ({
        campus: c,
        pos: latLngTo3D(c.lat!, c.lng!),
        size: markerSize(c.slug, c.status),
      }));

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: thetaRef.current,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.98, 0.96, 0.91],
      markerColor: [0.78, 0.56, 0.42],
      glowColor: [0.95, 0.8, 0.6],
      markers: markerList.map((m) => ({
        location: [m.campus.lat!, m.campus.lng!] as [number, number],
        size: m.size,
      })),
    });

    let raf = 0;
    let renderedScale = scaleRef.current;

    function frame() {
      const target = focusRef.current;
      if (target) {
        // Ease phi/theta toward focus target at ~6% per frame (feels 1.2s to settle).
        const dPhi = shortestPhiDelta(phiRef.current, target.phi);
        phiRef.current += dPhi * 0.06;
        thetaRef.current += (target.theta - thetaRef.current) * 0.06;
      } else if (pointerInteracting.current === null && !prefersReduced) {
        phiRef.current += 0.003;
      }

      // Lerp scale toward target.
      renderedScale += (scaleRef.current - renderedScale) * 0.08;

      globe.update({
        phi: phiRef.current + pointerInteractionMovement.current,
        theta: thetaRef.current,
        width: width * 2,
        height: width * 2,
        scale: renderedScale,
      });

      // Project markers onto screen and position overlay dots.
      const overlay = overlayRef.current;
      if (overlay) {
        const cPhi = Math.cos(phiRef.current + pointerInteractionMovement.current);
        const sPhi = Math.sin(phiRef.current + pointerInteractionMovement.current);
        const cTheta = Math.cos(thetaRef.current);
        const sTheta = Math.sin(thetaRef.current);

        for (const m of markerList) {
          const dot = dotRefs.current[m.campus.slug];
          if (!dot) continue;

          // Lift marker off surface slightly (matches cobe's 0.85-ish radius).
          const [x, y, z] = m.pos;
          const lx = x * 0.85;
          const ly = y * 0.85;
          const lz = z * 0.85;

          const c = cPhi * lx + sPhi * lz;
          const s = sPhi * sTheta * lx + cTheta * ly - cPhi * sTheta * lz;
          const depth =
            -sPhi * cTheta * lx + sTheta * ly + cPhi * cTheta * lz;

          // Aspect ratio = 1 (aspect-square). Scale = renderedScale.
          const screenX = (c * renderedScale + 1) / 2;
          const screenY = (-s * renderedScale + 1) / 2;
          const hidden = depth < 0 || c * c + s * s >= 0.64;

          dot.style.transform = `translate(${screenX * width}px, ${screenY * width}px) translate(-50%, -50%)`;
          dot.style.opacity = hidden ? "0" : "1";
          dot.style.pointerEvents = hidden ? "none" : "auto";
        }
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const fade = requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fade);
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [reducedMotion]);

  // Build the overlay dots (static render; positions are updated per frame).
  const markersStatic = campuses.filter(
    (c) => typeof c.lat === "number" && typeof c.lng === "number",
  );

  if (reducedMotion) {
    return <StaticGlobeFallback onCampusClick={onCampusClick} />;
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[780px]">
      <canvas
        ref={canvasRef}
        style={{ opacity: 0, transition: "opacity 900ms ease-out" }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          (e.currentTarget as HTMLCanvasElement).style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            pointerInteractionMovement.current =
              (e.clientX - pointerInteracting.current) * 0.005;
          }
        }}
      />
      {/* Overlay click targets — one invisible-ish button per campus. */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden={false}
      >
        {markersStatic.map((c) => (
          <button
            key={c.slug}
            ref={(el) => {
              dotRefs.current[c.slug] = el;
            }}
            type="button"
            onClick={() => onCampusClick?.(c.slug)}
            aria-label={`${c.name} — ${c.city}${c.status === "launching" ? " (launching)" : ""}`}
            title={`${c.name} · ${c.city}`}
            data-status={c.status}
            className={`globe-dot globe-dot-${c.status} absolute left-0 top-0 h-6 w-6 rounded-full transition-opacity duration-200`}
            style={{
              background: "transparent",
              transform: "translate(-9999px, -9999px)",
            }}
          />
        ))}
      </div>

      {/* Screen-reader / keyboard fallback — always present for a11y.
          Sighted users see the globe; assistive tech gets a semantic nav. */}
      <nav aria-label="Futures campuses by region" className="sr-only">
        <ul>
          {regions.map((r) => {
            const inRegion = campuses.filter((c) => c.region === r.slug);
            if (inRegion.length === 0) return null;
            return (
              <li key={r.slug}>
                <p>{r.name}</p>
                <ul>
                  {inRegion.map((c) => (
                    <li key={c.slug}>
                      <button type="button" onClick={() => onCampusClick?.(c.slug)}>
                        {c.name}, {c.city}
                        {c.status === "launching" ? " — launching" : ""}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>

      <style jsx>{`
        .globe-dot {
          cursor: pointer;
        }
        .globe-dot::before {
          content: "";
          position: absolute;
          inset: 9px;
          border-radius: 999px;
          background: rgba(200, 144, 107, 0);
          transition: inset 240ms cubic-bezier(0.25, 0.1, 0.25, 1),
                      background 240ms cubic-bezier(0.25, 0.1, 0.25, 1),
                      box-shadow 240ms cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .globe-dot-active::before {
          animation: dotPulseActive 2.4s ease-in-out infinite;
        }
        .globe-dot-launching::before {
          animation: dotPulseLaunching 4.2s ease-in-out infinite;
        }
        @keyframes dotPulseActive {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 144, 107, 0); }
          50%      { box-shadow: 0 0 0 3px rgba(200, 144, 107, 0.18),
                                  0 0 14px 3px rgba(200, 144, 107, 0.14); }
        }
        @keyframes dotPulseLaunching {
          0%, 100% { box-shadow: 0 0 0 0 rgba(172, 155, 37, 0); }
          50%      { box-shadow: 0 0 0 3px rgba(172, 155, 37, 0.22),
                                  0 0 18px 5px rgba(172, 155, 37, 0.18); }
        }
        .globe-dot:hover::before,
        .globe-dot:focus-visible::before {
          inset: 4px;
          background: rgba(253, 251, 246, 0.95);
          box-shadow: 0 0 0 2px rgba(200, 144, 107, 0.9),
                      0 0 18px 4px rgba(200, 144, 107, 0.35);
          animation: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .globe-dot::before { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

// Static fallback for users who prefer reduced motion.
// Semantic nav list grouped by region — fully keyboard-accessible, no WebGL.
function StaticGlobeFallback({
  onCampusClick,
}: {
  onCampusClick?: (slug: string) => void;
}) {
  return (
    <nav
      aria-label="Futures campuses by region"
      className="relative mx-auto aspect-square w-full max-w-[780px] overflow-hidden rounded-[28px]"
      style={{
        background:
          "radial-gradient(circle at 35% 32%, #FAE8D2 0%, #E8C9A6 55%, #C8906B 100%)",
        boxShadow:
          "0 30px 60px -30px rgba(200,144,107,0.45), inset 30px 30px 80px -10px rgba(255,252,247,0.45)",
      }}
    >
      <div className="absolute inset-0 overflow-auto p-8 sm:p-10">
        <p
          className="font-ui uppercase"
          style={{
            color: "#534D44",
            fontSize: 11,
            letterSpacing: "0.28em",
          }}
        >
          21 campuses · 4 countries
        </p>
        <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {regions.map((r) => {
            const inRegion = campuses.filter(
              (c) => c.region === r.slug && typeof c.lat === "number",
            );
            if (inRegion.length === 0) return null;
            return (
              <li key={r.slug}>
                <p
                  className="font-ui uppercase"
                  style={{
                    color: "#1C1A17",
                    fontSize: 12,
                    letterSpacing: "0.22em",
                  }}
                >
                  {r.name}
                  {r.status === "launching" ? " · launching" : ""}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {inRegion.map((c) => (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => onCampusClick?.(c.slug)}
                        className="font-display italic transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:underline"
                        style={{ color: "#1C1A17", fontSize: 16, fontWeight: 300 }}
                      >
                        {c.name} · {c.city}
                        {c.status === "launching" && (
                          <span
                            className="ml-2 font-ui uppercase"
                            style={{
                              color: "#534D44",
                              fontSize: 10,
                              letterSpacing: "0.2em",
                            }}
                          >
                            launching
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
