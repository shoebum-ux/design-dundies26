/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sun: '#FFD23F',
        coral: '#FF6B6B',
        ocean: '#1E90C6',
        deep: '#0B3C5D',
        mint: '#5FD9A6',
        sand: '#F8E7C2',
        cream: '#FFF6E5',
      },
      fontFamily: {
        display: ['"Luckiest Guy"', 'cursive'],
        body: ['"Baloo 2"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px -15px rgba(11, 60, 93, 0.45)',
        glow: '0 0 60px rgba(255, 210, 63, 0.55)',
      },
    },
  },
  plugins: [],
}
