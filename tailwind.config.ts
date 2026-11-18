import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EE",
        ink: "#24201B",
        copy: "#4A4237",
        muted: "#5E564D",
        faint: "#7D7365",
        line: "#E2DDD2",
        dot: "#C2BAAB",
        accent: "#7A1C28",
        pill: { DEFAULT: "#FAF8F3", hover: "#EFECE5" },
        night: { DEFAULT: "#090A0F", pill: "#11131A", hover: "#1A1D26" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
