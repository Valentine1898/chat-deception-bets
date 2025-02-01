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
          foreground: "#1A1A1A", // Dark text on beige
        },
        secondary: {
          DEFAULT: "#2A2A2A", // Darker gray for secondary elements
          foreground: "#E6D5BA", // Beige text on dark
        },
        background: "#1A1A1A", // Dark background
        foreground: "#E6D5BA", // Beige text
        muted: "#2A2A2A", // Darker gray for muted elements
        accent: "#E6D5BA", // Beige for accents
        card: {
          DEFAULT: "#2A2A2A", // Dark card background
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