import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * All colour values are driven by CSS custom properties defined in
 * `src/styles/tokens.css`. Components must reference these semantic names
 * (bg-primary, text-foreground, border-border ...) and never hardcode hex.
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
          strong: 'hsl(var(--border-strong))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          muted: 'hsl(var(--primary-muted))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          hover: 'hsl(var(--accent-hover))',
        },
        oak: {
          DEFAULT: 'hsl(var(--oak))',
          foreground: 'hsl(var(--oak-foreground))',
          muted: 'hsl(var(--oak-muted))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          muted: 'hsl(var(--success-muted))',
          text: 'hsl(var(--success-text))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          muted: 'hsl(var(--warning-muted))',
          // Companion shades: the exact brand warning cannot carry AA text.
          solid: 'hsl(var(--warning-solid))',
          text: 'hsl(var(--warning-text))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          muted: 'hsl(var(--destructive-muted))',
          text: 'hsl(var(--destructive-text))',
        },
        information: {
          DEFAULT: 'hsl(var(--information))',
          foreground: 'hsl(var(--information-foreground))',
          muted: 'hsl(var(--information-muted))',
          text: 'hsl(var(--information-text))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['clamp(2.75rem, 5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        display: ['clamp(2.25rem, 4vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-lg': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        heading: ['clamp(1.375rem, 2vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(31 37 33 / 0.04), 0 1px 3px 0 rgb(31 37 33 / 0.06)',
        card: '0 1px 3px 0 rgb(31 37 33 / 0.05), 0 4px 12px -2px rgb(31 37 33 / 0.06)',
        elevated: '0 4px 8px -2px rgb(31 37 33 / 0.06), 0 12px 28px -6px rgb(31 37 33 / 0.10)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [animate],
};

export default config;
