import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF6EE",
        ink: "#2B2118",
        cocoa: "#8B5E3C",
        sand: "#F1E4D3",
        sage: "#65745B",
      },
      boxShadow: {
        book: "0 12px 35px rgba(68, 45, 26, .09)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
