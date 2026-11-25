import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { baseConfig } from './base.js';

/** Vite + React apps (`@webuy/bo`). */
export default [
  ...baseConfig,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
