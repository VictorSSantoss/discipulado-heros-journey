import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // This covers everything in src
  ],
  theme: {
    extend: {
      fontFamily: {
        // These MUST match the variable names in fonts.ts (and globals.css for custom ones)
        future: ["var(--family-future)", "sans-serif"],
        bebas: ["var(--family-bebas)", "sans-serif"],
        barlow: ["var(--family-barlow)", "sans-serif"],
        staatliches: ["var(--family-staatliches)", "cursive"],
        fugaz: ["var(--family-fugaz)", "cursive"],
      },
      colors: {
        "dark-bg": "#02040a",
        "dark-surface": "#0a0d14",
        "dark-border": "#111621",
        brand: "#11c2c7",
        mission: "#10b981",
        xp: "#ea580c",
      },
    },
  },
  plugins: [],
};
export default config;