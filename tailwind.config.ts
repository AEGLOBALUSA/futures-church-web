import type { Config } from "tailwindcss";

// Futures Church — Brand Guidelines v1.0 (October '22) official palette.
// HEX values come directly from the brand guidelines PDF.
const brand = {
  // Primary vivid palette — these drive the site.
  violet: "#5D1FEC",   // Electric Violet — hero-hero
  pink: "#E444B9",     // Pink — magenta
  lemon: "#FFFF5F",    // Laser Lemon — shock yellow
  sky: "#62B4FF",      // Sky Blue
  ginger: "#FF8432",   // Ginger — bright orange
  orange: "#C45236",   // Orange — burnt orange
  copper: "#AC9B25",   // Copper — mustard
  thistle: "#C5C6A4",  // Thistle Green — sage
  brown: "#765020",    // Brown
  judge: "#50482E",    // Judge Gray — dark olive
};

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Round 0 Foundation tokens (warm / cream / ink / glass) ---
        cream: {
          DEFAULT: "#FDFBF6",
          50: "#FFFDF8",   // R5.4: codified — ultra-light cream (hover states, inset cards)
          100: "#FFFCF7",  // R5.4: codified — warmest cream (dark-bg text contrast)
          200: "#F7F1E6",  // R5.4: codified — hero gradient stop (lightest)
          300: "#F2E6D1",  // R5.4: codified — hero gradient stop (mid)
          400: "#E8C9A6",  // R5.4: codified — hero gradient stop (warm)
        },
        warm: {
          300: "#D9BFA0",
          400: "#CC8F4A",  // R5.4: codified — active-state amber (tabs, progress)
          500: "#C8906B",
          600: "#C89675",  // R5.4: codified — hero radial gradient stop
          700: "#8A5A3C",
          800: "#765020",  // R5.4: codified — deep brown (from brand guidelines)
        },
        // R5.4: codified — dark warm backgrounds for action-page contrast sections.
        umber: {
          900: "#141210",
          800: "#1B1008",
          700: "#2A1B10",
        },
        glass: {
          bg: "rgba(255,252,247,0.72)",
          border: "rgba(255,255,255,0.5)",
        },

        // Canonical brand tokens — use these in new code.
        brand: brand,
        violet: { DEFAULT: brand.violet, 500: brand.violet, 600: "#4A15C8", 700: "#3B10A0" },
        pink:   { DEFAULT: brand.pink,   500: brand.pink,   600: "#C4369F", 700: "#9E2B80" },
        lemon:  { DEFAULT: brand.lemon,  500: brand.lemon,  600: "#E0E043" },
        sky:    { DEFAULT: brand.sky,    500: brand.sky,    600: "#4A95DB" },
        ginger: { DEFAULT: brand.ginger, 500: brand.ginger, 600: "#DB6A1F" },
        copper: { DEFAULT: brand.copper, 500: brand.copper, 600: "#8A7D1D" },
        thistle:{ DEFAULT: brand.thistle,500: brand.thistle },
        judge:  { DEFAULT: brand.judge,  500: brand.judge },

        // Neutral rails for dark-first surfaces.
        obsidian: {
          DEFAULT: "#050506",
          900: "#050506",
          800: "#0D0D0F",
          700: "#141417",
          600: "#1B1B20",
          500: "#26262C",
          400: "#3A3A42",
          300: "#5A5A63",
        },
        bone: {
          DEFAULT: "#F6F4EE",
          50:  "#FBFAF6",
          100: "#F6F4EE",
          200: "#EAE6D9",
        },

        // --- Legacy aliases (kept so existing classes render; map to brand tones) ---
        paper: {
          DEFAULT: "#F6F4EE",
          100: "#FBFAF6",
          200: "#F6F4EE",
          300: "#EAE6D9",
          400: "#D6D0BD",
        },
        ink: {
          DEFAULT: "#1C1A17",
          950: "#020203",
          900: "#1C1A17",
          800: "#0D0D0F",
          700: "#141417",
          600: "#534D44",
          500: "#5A5A63",
          400: "#8A8178",
          300: "#8A8A94",
        },
        ember: {
          DEFAULT: brand.violet,
          300: "#8A5BFF",
          400: "#7438FF",
          500: brand.violet,
          700: "#3B10A0",
        },
        night: {
          DEFAULT: "#050506",
          900: "#050506",
          800: "#0D0D0F",
          700: "#141417",
        },
        pulse: {
          DEFAULT: brand.sky,
          500: brand.sky,
        },
        kingdom: {
          DEFAULT: brand.pink,
          700: "#9E2B80",
        },
        // Home redesign accent — terracotta. Used sparingly (≤3% visual weight):
        // AI pulsing dot, launching-campus marker, countdown numerals, stream
        // card arrow glyphs. Nowhere else. Restraint is the design.
        accent: {
          DEFAULT: "#B85C3B",
          muted: "rgba(184, 92, 59, 0.12)",
          ring:  "rgba(184, 92, 59, 0.32)",
        },
      },
      fontFamily: {
        // Round 0 / R5.3: Fraunces (display + body) + Inter Tight (ui/sans).
        // Tiempos left aliased to Fraunces until licensed.
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
        ui: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
        body: ["var(--font-fraunces)", "Georgia", "serif"],
        mark: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(4rem, 10vw, 10.5rem)", { lineHeight: "0.9", letterSpacing: "-0.025em" }],
        "display-xl": ["clamp(3rem, 7vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 4.75rem)", { lineHeight: "1.0", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "body-lg": ["1.25rem", { lineHeight: "1.55" }],
        "body": ["1.0625rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        "eyebrow": ["11px", { lineHeight: "1.2", letterSpacing: "0.24em" }],
        "meta": ["0.72rem", { lineHeight: "1.0", letterSpacing: "0.1em" }],
      },
      maxWidth: {
        prose: "640px",
        display: "1120px",
        shell: "1440px",
      },
      animation: {
        marquee: "marquee 50s linear infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "placeholder-in": "placeholderIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-dot": "pulseDot 1.8s ease-in-out infinite",
        "aurora": "aurora 18s ease infinite",
        "grain": "grain 8s steps(6) infinite",
        "glass-breathe": "glassBreathe 8s ease-in-out infinite",
        "input-breathe": "inputBreathe 4s ease-in-out infinite",
      },
      backdropBlur: {
        glass: "24px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        placeholderIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.4)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(5%, -3%, 0) scale(1.12)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
        glassBreathe: {
          "0%, 100%": { boxShadow: "0 20px 48px -24px rgba(20,20,20,0.22), inset 0 0 0 1px rgba(255,255,255,0.45)" },
          "50%":      { boxShadow: "0 26px 60px -28px rgba(20,20,20,0.28), inset 0 0 0 1px rgba(255,255,255,0.65)" },
        },
        inputBreathe: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200,144,107,0.0)" },
          "50%":      { boxShadow: "0 0 0 6px rgba(200,144,107,0.12)" },
        },
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
