export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'desa-bg': '#EFEDE6',
        'desa-surface': '#F9F8F5',
        'desa-primary': '#2F2F2D',
        'desa-accent': '#9E5335',
        'desa-highlight': '#485736',
        'desa-text': '#232220',
        'desa-muted': '#65635D',
        'desa-subtle': '#85827A',
        'desa-border': '#D8D5CC',
        'desa-light': '#EFEDE6',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"Work Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'lurik-stripes': 'repeating-linear-gradient(90deg, #2F2F2D 0px, #2F2F2D 1.5px, transparent 1.5px, transparent 8px)',
        'lurik-stripes-light': 'repeating-linear-gradient(90deg, rgba(239, 237, 230, 0.4) 0px, rgba(239, 237, 230, 0.4) 1.5px, transparent 1.5px, transparent 8px)',
        'lurik-stripes-accent': 'repeating-linear-gradient(90deg, #9E5335 0px, #9E5335 1.5px, transparent 1.5px, transparent 7px)',
      }
    },
  },
  plugins: [],
};
