export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        card: 'var(--card)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        'text-faint': 'var(--text-faint)',
        surface: 'var(--surface)',
        'surface-active': 'var(--surface-active)',
        'border-hover': 'var(--border-hover)',
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        'status-healthy': 'var(--status-healthy)',
        'status-degraded': 'var(--status-degraded)',
        'status-danger': 'var(--status-danger)',
      }
    },
  },
  plugins: [],
}
