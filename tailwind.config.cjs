/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    colors: {
      primary: '#dd6e42',
      secondary: '#e8dab2',
      tertiary: '#4f6d7a',
      'tertiary-light': '#c0d6df',
      light: '#eaeaea',
    },
    fontFamily: {
      base: "'Nixie One', cursive",
      display: "'Inter', sans-serif"
    },
    extend: {
      fontSize: {
        base: '1.1rem'
      },
      minHeight: {
        hero: 'calc(100vh - 4rem)'
      }
    },
  },
  plugins: [],
}
