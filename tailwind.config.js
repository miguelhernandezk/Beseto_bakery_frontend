module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'beseto-dark-gray': '#2D2D2D',
        'beseto-bisque': '#F6D9B6',
        'beseto-chocolate': '#733315',
        'beseto-midnight-blue': '#1D185B',
      },
      dropShadow: {
        '2xl': '-0.5rem 0.5rem 0.4rem rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        footerImage: "url('/img/hero-pattern.svg')",
      },
      width: {
        112: '28rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
        300: '75rem',
      },
    },
    screens: {
      xs: '0px',
      sm: '480px',
      md: '780px',
      lg: '1024px',
      xl: '1200px',
      '2xl': '1536px',
    },
  },
  plugins: [],
};
