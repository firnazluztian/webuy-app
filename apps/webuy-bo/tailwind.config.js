const { kiichanTheme, kiichanContent } = require('@webuy/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    ...kiichanContent('.'),
  ],
  ...kiichanTheme,
};
