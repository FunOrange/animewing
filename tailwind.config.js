/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dusk: {
          50: "#e5d9e3",
          100: "#c9b2bf",
          200: "#a08c9a",
          300: "#7f6784",
          400: "#5f4b6a",
          500: "#4a3a56",
          600: "#3b2a44",
          700: "#2f2037",
          800: "#251731",
          900: "#1d1027",
        },
      },
    },
  },
  plugins: [],
};
