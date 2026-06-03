/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#208f6a',
          light: '#e9f0ec',
          dark: '#1a7356',
        },
        accent: {
          DEFAULT: '#e5c466',
          light: '#f5e8b3',
        },
        background: '#ffffff',
        foreground: '#1a202c',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
