module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'medrx': '#30b59e',
      },
      borderRadius: {
        '4xl': '5rem;',
        '5xl': '7.5rem',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
