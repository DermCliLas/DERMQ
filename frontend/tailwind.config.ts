import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // DERMQ Official Brand Palette (Serene Derm)
        primary: '#72c1c1',
        'on-primary': '#ffffff',
        'primary-container': '#02696a',
        'on-primary-container': '#ffffff',

        secondary: '#B7B0D3',
        'on-secondary': '#ffffff',
        'secondary-container': '#484360',
        'on-secondary-container': '#ffffff',

        tertiary: '#F0A17E',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#8c4e31',
        'on-tertiary-container': '#ffffff',

        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        background: '#F2F4F4',
        'on-background': '#191c1d',
        surface: '#F2F4F4',
        'on-surface': '#191c1d',
        'surface-variant': '#e1e3e3',
        'on-surface-variant': '#3e4948',
        'inverse-surface': '#2e3131',
        'inverse-on-surface': '#eff1f1',

        outline: '#6e7979',
        'outline-variant': '#bec9c8',
      },
      fontFamily: {
        headline: ['var(--font-playfair)', '"Playfair Display"', 'serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        label: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.25rem',
        lg: '0.5rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
        full: '9999px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out -3s infinite',
        'text-reveal': 'textReveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) both',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'ken-burns': 'kenBurns 20s ease-out infinite alternate',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        textReveal: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(2, 105, 106, 0.3)' },
          '50%': { boxShadow: '0 0 35px rgba(2, 105, 106, 0.7)' },
        },
      },
      boxShadow: {
        glow: '0 0 25px rgba(2, 105, 106, 0.5)',
        'glow-lg': '0 0 40px rgba(2, 105, 106, 0.6)',
        'colored-secondary': '0 25px 50px -12px rgba(183, 176, 211, 0.6)',
        premium: '0 25px 50px rgba(0,0,0,0.15)',
        'booking-summary': '0 20px 60px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
