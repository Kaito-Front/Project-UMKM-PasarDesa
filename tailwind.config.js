
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'desa-bg': '#EFEDE6',
        'desa-primary': '#3A3A38',
        'desa-accent': '#A85C3C',
        'desa-highlight': '#526341',
        'desa-text': '#232220',
        'desa-light': '#EFEDE6',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"Work Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'lurik-stripes': 'repeating-linear-gradient(90deg, #3A3A38 0px, #3A3A38 1.5px, transparent 1.5px, transparent 8px)',
        'lurik-stripes-light': 'repeating-linear-gradient(90deg, rgba(239, 237, 230, 0.4) 0px, rgba(239, 237, 230, 0.4) 1.5px, transparent 1.5px, transparent 8px)',
        'lurik-stripes-accent': 'repeating-linear-gradient(90deg, #A85C3C 0px, #A85C3C 1.5px, transparent 1.5px, transparent 7px)',
      }
    },
  },
  plugins: [],
};

