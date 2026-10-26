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
        fin: {
          bg: 'var(--fin-bg)',
          sidebar: 'var(--fin-sidebar)',
          card: 'var(--fin-card)',
          'card-secondary': 'var(--fin-card-secondary)',
          'card-hover': 'var(--fin-card-hover)',
          border: 'var(--fin-border)',
          'border-focus': 'var(--fin-border-focus)',
          text: 'var(--fin-text)',
          'text-secondary': 'var(--fin-text-secondary)',
          'text-muted': 'var(--fin-text-muted)',
          accent: 'var(--fin-accent)',
          'accent-secondary': 'var(--fin-accent-secondary)',
          'accent-glow': 'var(--fin-accent-glow)',
          positive: '#10B981',
          negative: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'fin-card': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'fin-card-hover': '0 12px 36px rgba(0, 0, 0, 0.22)',
        'fin-glow': '0 0 25px var(--fin-accent-glow)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
