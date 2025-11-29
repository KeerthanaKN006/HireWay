/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#470524ff", // Indigo-600
        secondary: "#f4eddcff", // Slate-500
      }
    },
  },
  plugins: [],
}