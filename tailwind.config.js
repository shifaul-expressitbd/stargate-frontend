/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
        notosansbengali: ['"Noto Sans Bengali"', 'sans-serif'],
        kobiguru: ['Kobiguru', 'sans-serif'],
        plusjakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        pollinator: 'Pollinator',
        autography: 'Autography',
        airstrip: 'Airstrip',
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--primary-foreground)',
          dark: 'var(--color-primary-dark)'
        },
        main: 'var(--color-main)',
        secondary: 'var(--color-secondary)',
        base: 'var(--color-base)',
        tertiary: 'var(--color-tertiary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)'
      },
      keyframes: {
        wave: {
          '0%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0.4)' }
        },
        runCircle: {
          '0%': { transform: 'translate(-50%, 0) rotate(0deg)' },
          '25%': { transform: 'translate(-50%, 0) rotate(90deg)' },
          '50%': { transform: 'translate(-50%, 0) rotate(180deg)' },
          '75%': { transform: 'translate(-50%, 0) rotate(270deg)' },
          '100%': { transform: 'translate(-50%, 0) rotate(360deg)' }
        }
      },
      animation: {
        wave: 'wave 1.2s ease-in-out infinite',
        'run-circle': 'runCircle 15s linear infinite'
      },
      clipPath: {
        'triangle-left': 'polygon(100% 0, 0 50%, 100% 100%)',
        'triangle-right': 'polygon(0 0, 100% 50%, 0 100%)'
      }
    }
  },
  plugins: [require('tailwind-scrollbar')]
}
