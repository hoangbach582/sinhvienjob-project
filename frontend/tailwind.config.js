/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3B82F6',
          indigo: '#6366F1',
          purple: '#A855F7',
          orange: '#F97316',
          yellow: '#FBBF24',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'page-dark': 'hsl(var(--page-dark))',
        'hero-dark': 'hsl(var(--hero-dark))',
        'search-bar': 'hsl(var(--search-bar))',
        'stats-panel': 'hsl(var(--stats-panel))',
        'light-section': 'hsl(var(--light-section))',
        card: 'hsl(var(--card))',
        'card-muted': 'hsl(var(--card-muted))',
        'purple-banner': 'hsl(var(--purple-banner))',
        'footer-dark': 'hsl(var(--footer-dark))',
        'button-primary': 'hsl(var(--button-primary))',
        'button-secondary-dark': 'hsl(var(--button-secondary-dark))',
        'chip-surface': 'hsl(var(--chip-surface))',
        'pill-light': 'hsl(var(--pill-light))',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        body: ["'Inter'", 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grad-page-background': 'linear-gradient(90deg, #09144B 0%, #0B1656 45%, #5A1FC8 100%)',
        'grad-primary-button': 'linear-gradient(90deg, #A45BFF 0%, #8F4BFF 50%, #7B3FFF 100%)',
        'grad-stats-panel': 'linear-gradient(90deg, #3A2C88 0%, #4B36A8 50%, #2C235F 100%)',
        'grad-promo-banner': 'linear-gradient(90deg, #6E2CDB 0%, #151B73 45%, #3D2DD5 100%)',
        'grad-footer-background': 'linear-gradient(90deg, #07103F 0%, #0A1658 55%, #06103A 100%)',
        'grad-badge-fill': 'linear-gradient(90deg, rgba(164,91,255,0.22) 0%, rgba(143,75,255,0.14) 100%)',
        'grad-card-border': 'linear-gradient(180deg, rgba(184,124,255,0.7) 0%, rgba(79,124,255,0.35) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
