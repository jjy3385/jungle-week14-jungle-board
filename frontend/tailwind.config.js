/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        minihome: ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#1f2f4a',
          navyLight: '#3e5f8a',
          muted: '#61738a',
          sky: '#55a6ff',
          skyLight: '#eaf6ff',
          skyBorder: '#d6e4f7',
        },
      },
    },
  },
  plugins: [],
};
