/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#ec4899",
        accent: "#8b5cf6",
        background: "#0f172a",
        surface: "#1e293b",
        "surface-hover": "#334155",
        text: "#f8fafc",
        "text-muted": "#94a3b8",
        "glass-border": "rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
}
