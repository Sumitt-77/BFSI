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
        fintech: {
          dark: '#070b14',
          darker: '#04070d',
          card: 'rgba(16, 24, 40, 0.65)',
          cardHover: 'rgba(23, 34, 56, 0.8)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(56, 189, 248, 0.3)',
          primary: '#0ea5e9',
          primaryGlow: '#38bdf8',
          accent: '#6366f1',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#f43f5e',
          textMuted: '#94a3b8',
        }
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 25px -5px rgba(14, 165, 233, 0.3)',
        glowSuccess: '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        glowWarning: '0 0 25px -5px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
