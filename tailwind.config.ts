import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#020408",
          900: "#050810",
          800: "#080f1e",
          700: "#0a1228",
          600: "#0d1a38",
          500: "#112248",
        },
        pulse: {
          DEFAULT: "#1d9e75",
          light: "#5dcaa5",
          dim: "#0f6e56",
          faint: "#e1f5ee",
        },
        arc: {
          DEFAULT: "#378add",
          light: "#85b7eb",
          dim: "#185fa5",
          faint: "#e6f1fb",
        },
        seismic: {
          low: "#9fe1cb",
          minor: "#1d9e75",
          moderate: "#ef9f27",
          strong: "#e24b4a",
          major: "#a32d2d",
        },
        aurora: "#7f77dd",
        tsunami: "#378add",
        volcano: "#ef9f27",
        iss: "#5dcaa5",
        solar: "#fac775",
        meteor: "#b4b2a9",
      },
      fontFamily: {
        serif: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["11px", { lineHeight: "16px" }],
        sm: ["12px", { lineHeight: "18px" }],
        md: ["14px", { lineHeight: "20px" }],
      },
      borderColor: {
        subtle: "rgba(100, 160, 255, 0.12)",
        medium: "rgba(100, 160, 255, 0.22)",
        strong: "rgba(100, 160, 255, 0.40)",
      },
      backdropBlur: {
        xs: "4px",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "pulse-ring": "ring 2s ease-out infinite",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.35s ease forwards",
        "slide-right": "slideRight 0.3s ease forwards",
      },
      keyframes: {
        ring: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "glow-teal": "0 0 20px rgba(29, 158, 117, 0.3)",
        "glow-blue": "0 0 20px rgba(55, 138, 221, 0.3)",
        "glow-red": "0 0 20px rgba(226, 75, 74, 0.3)",
        panel: "0 4px 32px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
} satisfies Config;
