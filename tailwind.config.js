module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'medrx': '#30b59e',
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
