/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1729',
        'ink-2': '#182238',
        paper: '#F4EFE3',
        'paper-dark': '#E9E1CC',
        brass: '#C9A227',
        'brass-light': '#E4C158',
        redpen: '#B23A2E',
        charcoal: '#23262B',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'paper-lines':
          'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(178,58,46,0.08) 28px)',
      },
      keyframes: {
        stampDown: {
          '0%': { transform: 'scale(3.2) rotate(-18deg)', opacity: '0' },
          '55%': { transform: 'scale(0.92) rotate(-8deg)', opacity: '1' },
          '75%': { transform: 'scale(1.05) rotate(-10deg)' },
          '100%': { transform: 'scale(1) rotate(-8deg)', opacity: '1' },
        },
        inkPulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        riseIn: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        stamp: 'stampDown 0.7s cubic-bezier(.2,.9,.3,1.2) forwards',
        inkPulse: 'inkPulse 1.4s ease-in-out infinite',
        riseIn: 'riseIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
