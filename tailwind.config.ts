import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#b8d0ff",
          300: "#8ab0ff",
          400: "#5687ff",
          500: "#2f5dff",
          600: "#1a41f0",
          700: "#1533c4",
          navy: "#0f1c3f",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f4f7fc",
          border: "#e6ebf5",
        },
        success: {
          DEFAULT: "#16a34a",
          bg: "#eafaf0",
        },
        warn: {
          DEFAULT: "#d97706",
          bg: "#fff4e0",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 28, 63, 0.04), 0 8px 24px rgba(15, 28, 63, 0.06)",
        panel: "0 1px 3px rgba(15, 28, 63, 0.06), 0 16px 40px rgba(15, 28, 63, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
