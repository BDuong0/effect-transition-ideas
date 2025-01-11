/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      "5xl": "var(--font-5xl)",
      "4xl": "var(--font-4xl)",
      "3xl": "var(--font-3xl)",
      "2xl": "var(--font-2xl)",
      xl: "var(--font-xl)",
      lg: "var(--font-large)",
      base: "var(--font-medium)",
      sm: "var(--font-small)",
      xs: "var(--font-xs)",
    },
    extend: {
      colors: {
        primary: "var(--background-primary-default)",
        "primary-hover": "var(--background-primary-hover)",
        selected: "var(--background-primary-selected)",
      },
      fontFamily: {
        primary: "var(--font-primary)",
        accent: "var(--font-accent)",
      },
    },
  },
  plugins: [],
};
