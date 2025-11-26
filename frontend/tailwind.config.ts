import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.svg",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          DEFAULT: "#22d3ee",
          muted: "#67e8f9",
        },
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(79, 70, 229, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
