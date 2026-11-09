export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60% Sage Mist Ground & Surfaces
        'desa-bg': '#E8ECE6',
        'desa-surface': '#F2F5F0',
        'desa-border': '#D1D8CE',
        'desa-light': '#F8FAF7',
        'sage-mist': '#E8ECE6',
        'sage-surface': '#F2F5F0',
        'sage-border': '#D1D8CE',

        // 30% Deep Forest Ink, Structure & Typography
        'desa-primary': '#1C2D22',
        'desa-text': '#18251C',
        'desa-muted': '#506154',
        'desa-subtle': '#758579',
        'deep-forest': '#1C2D22',
        'forest-dark': '#142119',
        'forest-muted': '#506154',

        // 10% Sunbeam Yellow Eye-Catching Accent & Highlights
        'desa-accent': '#F5B731',
        'desa-highlight': '#E5A51E',
        'sunbeam': '#F5B731',
        'sunbeam-glow': '#FEF9EE',
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
