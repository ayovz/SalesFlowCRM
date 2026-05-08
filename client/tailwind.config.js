/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:                    '#1a2c70',
        'primary-container':        '#334488',
        'on-primary':               '#ffffff',
        'on-primary-container':     '#c8d4ff',
        surface:                    '#f9f9f9',
        'surface-container':        '#efefef',
        'surface-container-lowest': '#ffffff',
        'on-surface':               '#1b1b1b',
        'on-surface-variant':       '#5f5f6f',
        'outline-variant':          '#c5c5d2',
        'status-won':               '#10b981',
        'status-lost':              '#ef4444',
        'status-new':               '#f59e0b',
        'status-contacted':         '#3b82f6',
        'status-qualified':         '#8b5cf6',
        'status-proposal':          '#f97316',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}
