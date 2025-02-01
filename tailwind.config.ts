import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E6D5BA", // Beige color from the button
          foreground: "rgb(28 25 23)", // stone-900
        },
        secondary: {
          DEFAULT: "rgb(68 64 60)", // stone-700
          foreground: "#E6D5BA", // Beige text on dark
        },
        background: "rgb(41 37 36)", // stone-800
        foreground: "#E6D5BA", // Beige text
        muted: "rgb(68 64 60)", // stone-700
        accent: "#E6D5BA", // Beige for accents
        card: {
          DEFAULT: "rgb(68 64 60)", // stone-700
          foreground: "#E6D5BA", // Beige text on card
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;