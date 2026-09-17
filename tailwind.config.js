/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f6ff',
          100: '#e0eeff',
          200: '#c2e0ff',
          300: '#9dc7ff',
          400: '#6da8ff',
          500: '#1e65f3',
          600: '#1e65f3',
          700: '#1e65f3',
          800: '#1e65f3',
          900: '#1e65f3',
          950: '#1e65f3',
        },
        indigo: {
          900: '#1e65f3',
        },
      },
    },
  },
  plugins: [],
}
