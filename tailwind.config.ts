import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./base/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        canvas: "var(--canvas)",
        surface: {
          DEFAULT: "var(--surface)",
          soft: "var(--surface-soft)",
          subtle: "var(--surface-subtle)",
        },
        line: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
          dashed: "var(--border-dashed)",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,15,15,.1)",
        float: "0 6px 20px rgba(15,15,15,.06)",
        hero: "0 12px 40px rgba(15,15,15,.08)",
      },
      borderRadius: {
        control: "6px",
        card: "10px",
        swatch: "9px",
      },
    },
  },
  plugins: [],
};

export default config;
