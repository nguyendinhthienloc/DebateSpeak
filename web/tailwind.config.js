/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--background)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
