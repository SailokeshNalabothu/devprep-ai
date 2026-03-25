/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fdfbf7",
        forest: "#1a2e1a",
        leaf: {
          light: "#4a7c44",
          DEFAULT: "#2d5a27",
          dark: "#1a2e1a",
        },
        sage: "#4a7c44",
      },
    },
  },
  plugins: [],
}