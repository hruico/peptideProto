/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        base: '#0A0A0F',
        surface: '#13131A',
        'surface-elevated': '#1C1C26',
        'surface-border': '#2A2A3A',
        'accent-orange': '#FF6B2B',
        'accent-orange-light': '#FF8C55',
        'accent-violet': '#7B4FFF',
        'accent-violet-light': '#9B6FFF',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0B8',
        'text-tertiary': '#60607A',
      },
    },
  },
  plugins: [],
};
