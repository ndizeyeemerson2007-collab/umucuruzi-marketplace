import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ["0.6875rem", { lineHeight: "1rem" }], // 11px
      sm: ["0.75rem", { lineHeight: "1.15rem" }], // 12px
      base: ["0.8125rem", { lineHeight: "1.3rem" }], // 13px
      lg: ["0.875rem", { lineHeight: "1.35rem" }], // 14px
      xl: ["1rem", { lineHeight: "1.5rem" }], // 16px
      "2xl": ["1.125rem", { lineHeight: "1.6rem" }], // 18px
      "3xl": ["1.375rem", { lineHeight: "1.75rem" }], // 22px
      "4xl": ["1.75rem", { lineHeight: "2.1rem" }], // 28px
      "5xl": ["2.125rem", { lineHeight: "2.4rem" }], // 34px
    },
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
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "ui-sans-serif",
          "system-ui",
          "Arial",
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
