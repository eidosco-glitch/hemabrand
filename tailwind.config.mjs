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
        paper: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#000000',
        muted: '#808080',
        accent: '#A67B5B',
        border: '#D1CCC6',
        footer: '#F5F5F5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'var(--font-amiri)', 'serif'],
      },
    },
  },
  plugins: [],
}