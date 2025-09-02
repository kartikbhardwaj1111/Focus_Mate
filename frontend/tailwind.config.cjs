/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#07070a',
        'bg-darker': '#0b0b0d',
        'muted': '#bdbdbf',
      },
      boxShadow: {
        glow: '0 0 30px rgba(107,140,255,0.25)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg,#6B8CFF 0%, #B776FF 100%)',
      },
    },
  },
  plugins: [],
};