/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f6f9f1',
          100: '#eaf1de',
          200: '#d4e3be',
          300: '#b8cf95',
          400: '#98b669',
          500: '#7a9b47',
          600: '#5e7a34',
          700: '#485e2a',
          800: '#3a4b24',
          900: '#324021',
        },
        gold: {
          500: '#eab308',
          600: '#ca8a04',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
