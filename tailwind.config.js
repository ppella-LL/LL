/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand accent (fintech-bold orange).
        brand: {
          DEFAULT: '#ff6600',
          dark: '#e65c00',
          soft: 'rgb(255 102 0 / 0.1)',
        },
        // Semantic tokens driven by CSS variables so they flip with the theme.
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-soft': 'rgb(var(--content-soft) / <alpha-value>)',
        'content-faint': 'rgb(var(--content-faint) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'ink': 'rgb(var(--ink) / <alpha-value>)',
        'ink-content': 'rgb(var(--ink-content) / <alpha-value>)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        // Soft, diffuse elevation (modern, not heavy).
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.10)',
        'soft-lg': '0 2px 4px rgb(0 0 0 / 0.04), 0 16px 40px -12px rgb(0 0 0 / 0.16)',
        glow: '0 8px 30px -6px rgb(255 102 0 / 0.45)',
      },
    },
  },
  plugins: [],
};
