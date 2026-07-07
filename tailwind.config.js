export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#0B0F19',
        'bg-main': '#0F172A',
        'glass-base': 'rgba(30, 41, 59, 0.7)',
        'glass-light': 'rgba(51, 65, 85, 0.4)',
        'glass-border': 'rgba(148, 163, 184, 0.1)',
        'glass-border-hover': 'rgba(148, 163, 184, 0.2)',
        'text-main': '#F8FAFC',
        'text-muted': '#94A3B8',
        'text-disabled': '#475569',
        'primary-cyan': '#06B6D4',
        'primary-blue': '#3B82F6',
        'status-success': '#10B981',
        'status-danger': '#EF4444',
        'status-warning': '#F59E0B',
        'accent-gold': '#FBBF24',
        'secondary-violet': '#8B5CF6'
      },
      boxShadow: {
        'depth': '0 10px 30px -10px rgba(0,0,0,0.5)'
      }
    },
  },
  plugins: [],
}
