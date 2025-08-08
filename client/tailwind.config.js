/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       animation: {
      slideInRight: 'slideInRight 0.3s ease-out',
    },
    slideInRight: {
        '0%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(0)' },
      },
    },
  },
  plugins: [],
}

