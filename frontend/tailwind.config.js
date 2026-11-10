/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60% Oatmilk Main Canvas, Ground & Surface
        'desa-bg': '#FBF8F3',
        'desa-surface': '#F4EFE6',
        'desa-card': '#FFFFFF',
        'desa-border': '#E8E0D5',
        'desa-light': '#FFFFFF',
        'oatmilk': '#FBF8F3',
        'oatmilk-surface': '#F4EFE6',
        'oatmilk-border': '#E8E0D5',
        'oatmilk-dark': '#EDE5D8',

        // 30% Forest Green Second Color (Typography, Headings, Structure & Dark Cards)
        'desa-primary': '#163324',
        'desa-text': '#183324',
        'desa-muted': '#4A6B59',
        'desa-subtle': '#6D8F7D',
        'forest-green': '#163324',
        'forest-surface': '#1F4532',
        'forest-border': '#2E5E45',
        'forest-muted': '#4A6B59',
        'forest-dark': '#0E2117',

        // 10% Tomato Red Loud Accent / Attention Grabber
        'desa-accent': '#E83D23',
        'desa-highlight': '#CF3018',
        'tomato-red': '#E83D23',
        'tomato-hover': '#CF3018',
        'tomato-glow': 'rgba(232, 61, 35, 0.25)',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"Work Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'lurik-stripes': 'repeating-linear-gradient(90deg, #163324 0px, #163324 1.5px, transparent 1.5px, transparent 8px)',
        'lurik-stripes-light': 'repeating-linear-gradient(90deg, rgba(251, 248, 243, 0.5) 0px, rgba(251, 248, 243, 0.5) 1.5px, transparent 1.5px, transparent 8px)',
        'lurik-stripes-accent': 'repeating-linear-gradient(90deg, #E83D23 0px, #E83D23 1.5px, transparent 1.5px, transparent 7px)',
      }
    },
  },
  plugins: [],
};
