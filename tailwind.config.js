/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // This enables the dark mode feature
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    function({ addUtilities }) {
      const newUtilities = {
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        },
      };
      addUtilities(newUtilities);
    }, // Add this line
  ],
}