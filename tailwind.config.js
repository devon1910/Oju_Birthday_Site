/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0a0a',
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
        },
        light: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#e5e5e5',
        },
        rose: {
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Outfit', 'sans-serif'],
        'script': ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
}

