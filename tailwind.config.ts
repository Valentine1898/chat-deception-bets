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
      fontFamily: {
        serif: ['Inria Serif', 'serif'],
        sans: ['Instrument Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#FD9A00",
          foreground: "#0C0A09",
        },
        secondary: {
          DEFAULT: "#292524",
          foreground: "#FFFFFF",
        },
        background: "#1C1917",
        foreground: "#E6D5BA",
        muted: "#44403B",
        accent: "#05DF72",
        card: {
          DEFAULT: "#292524",
          foreground: "#FFFFFF",
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