/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  dropShadow: {
    glow: [
      "0 0px 20px rgba(255,255, 255, 0.35)",
      "0 0px 65px rgba(255, 255,255, 0.2)",
    ]
  }
}

