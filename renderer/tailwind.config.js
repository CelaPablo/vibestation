const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      gray: colors.gray,
      blue: colors.blue,
      
      white: colors.white,
      green: colors.green,
      black: colors.black,
      red: colors.red,
    },
    extend: {},
  },
  plugins: [],
};