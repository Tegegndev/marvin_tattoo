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
          DEFAULT: "#0a0a0c",
          950: "#0a0a0c", // Deepest canvas black
          900: "#111114", // Main background & cards
          850: "#16161b", // Containers & sub-cards
          800: "#1c1c22", // Elevated surfaces & active states
          700: "#272730", // Standard borders & dividers
          600: "#363642", // Highlight borders
        },
        crimson: {
          DEFAULT: "#8f131d", // Signature atelier gothic red
          hover: "#a61723",
          light: "#ff6b72",
          dark: "#570a10",
        },
        gold: {
          DEFAULT: "#c5a059", // Luxury piercing & antique brass
          hover: "#d9b369",
          light: "#f3d999",
          dark: "#7c622e",
        },
        bone: {
          DEFAULT: "#f4f4f5", // High-contrast primary text
          muted: "#a1a1aa",   // Secondary descriptive text
          dim: "#71717a",     // Tertiary captions & metadata
        },
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
        "title-editorial": ["'Bodoni Moda'", "serif"],
        "body-lg": ["'Geist'", "sans-serif"],
        "display-hero": ["'Bodoni Moda'", "serif"],
        "body-md": ["'Geist'", "sans-serif"],
        "headline-md": ["'Bodoni Moda'", "serif"],
        "headline-lg": ["'Bodoni Moda'", "serif"],
        "body-sm": ["'Geist'", "sans-serif"],
        "display-hero-mobile": ["'Bodoni Moda'", "serif"],
        "headline-xl-mobile": ["'Bodoni Moda'", "serif"],
        "headline-xl": ["'Bodoni Moda'", "serif"],
        "label-data": ["'Geist'", "sans-serif"],
        "headline-lg-mobile": ["'Bodoni Moda'", "serif"],
        "headline-sm": ["'Bodoni Moda'", "serif"],
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
