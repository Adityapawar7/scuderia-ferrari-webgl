/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rosso: {
          light: '#D0000A',
          DEFAULT: '#C1121F',
          dark: '#900005',
        },
        carbon: '#0A0A0B',
        offwhite: '#F5F1EC',
        accent: '#FFBA00'
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
