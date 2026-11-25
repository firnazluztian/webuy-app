const { kiichanTheme, kiichanContent } = require('@webuy/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    ...kiichanContent('.'),
  ],
  ...kiichanTheme,
};
