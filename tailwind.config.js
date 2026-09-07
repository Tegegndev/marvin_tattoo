/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: "#090a0c",
          950: "#090a0c", // Deepest canvas black
          900: "#101216", // Main background & cards
          850: "#16191f", // Containers & sub-cards
          800: "#1e222b", // Elevated surfaces & active states
          750: "#252b36",
          700: "#2d3442", // Standard borders & dividers
          600: "#414b5d", // Highlight borders
        },
        // Signature Studio Crimson Red (rich, visible, high-end gothic punch)
        crimson: {
          DEFAULT: "#991b1b", // Rich deep crimson red for primary buttons & highlights
          hover: "#b91c1c",   // Bright crimson hover
          light: "#ef4444",   // High-contrast vivid red for tags, badges & icons
          dark: "#7f1d1d",    // Deep blood red
          subtle: "rgba(153, 27, 27, 0.2)"
        },
        // Muted Zinc / Pewter / Titanium (replaces saturated gold)
        gold: {
          DEFAULT: "#94a3b8", // Muted titanium slate
          hover: "#cbd5e1",   // Light silver
          light: "#e2e8f0",   // Crisp titanium highlight
          dark: "#475569",    // Dark pewter
        },
        bone: {
          DEFAULT: "#f8fafc", // High-contrast clean off-white
          muted: "#94a3b8",   // Slate-400 secondary text
          dim: "#64748b",     // Slate-500 tertiary text & subtle labels
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        }
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "4rem",
        "space-2xs": "0.25rem",
        "gutter-desktop": "2rem",
        "space-4xl": "6rem",
        "space-xs": "0.5rem",
        "space-3xl": "4.5rem",
        "space-md": "1rem",
        "margin-mobile": "1.25rem",
        "space-3xs": "0.125rem",
        "space-lg": "1.5rem",
        "gutter-mobile": "1rem",
        "space-2xl": "3rem",
        "space-sm": "0.75rem",
        "space-xl": "2rem"
      },
      fontFamily: {
        "label-caps": ["'Geist'", "sans-serif"],
        "title-editorial": ["'Limelight'", "cursive", "serif"],
        "body-lg": ["'Geist'", "sans-serif"],
        "display-hero": ["'Limelight'", "cursive", "serif"],
        "body-md": ["'Geist'", "sans-serif"],
        "headline-md": ["'Limelight'", "cursive", "serif"],
        "headline-lg": ["'Limelight'", "cursive", "serif"],
        "body-sm": ["'Geist'", "sans-serif"],
        "display-hero-mobile": ["'Limelight'", "cursive", "serif"],
        "headline-xl-mobile": ["'Limelight'", "cursive", "serif"],
        "headline-xl": ["'Limelight'", "cursive", "serif"],
        "limelight": ["'Limelight'", "cursive", "serif"],
        "label-data": ["'Geist'", "sans-serif"],
        "headline-lg-mobile": ["'Limelight'", "cursive", "serif"],
        "headline-sm": ["'Limelight'", "cursive", "serif"],
      },
      fontSize: {
        "label-caps": ["11px", { lineHeight: "16px", letterSpacing: "0.22em", fontWeight: "600" }],
        "title-editorial": ["18px", { lineHeight: "26px", letterSpacing: "0.08em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "0.01em", fontWeight: "400" }],
        "display-hero": ["96px", { lineHeight: "100px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "body-md": ["15px", { lineHeight: "24px", letterSpacing: "0.015em", fontWeight: "400" }],
        "headline-md": ["28px", { lineHeight: "36px", letterSpacing: "0em", fontWeight: "500" }],
        "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-sm": ["13px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "400" }],
        "display-hero-mobile": ["48px", { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-xl-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-xl": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "label-data": ["13px", { lineHeight: "18px", letterSpacing: "0.06em", fontWeight: "500" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "0em", fontWeight: "600" }],
        "headline-sm": ["22px", { lineHeight: "30px", letterSpacing: "0.01em", fontWeight: "500" }],
      }
    },
  },
  plugins: [],
}
