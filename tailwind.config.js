/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C1810',
        secondary: '#8B4513',
        accent: '#D4AF37',
        surface: '#F5E6D3',
        background: '#FBF8F3',
        success: '#2D5016',
        warning: '#C17817',
        error: '#8B2635',
        info: '#1E4D6B'
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Lora', 'serif'],
        'ui': ['Inter', 'sans-serif']
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '28px'],
        'lg': ['20px', '32px'],
        'xl': ['25px', '36px'],
        '2xl': ['31px', '44px'],
        '3xl': ['39px', '52px']
      },
      lineHeight: {
        'reading': '1.8'
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}