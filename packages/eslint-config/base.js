import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Shared WeBuy ESLint flat config — lint + no-console + TS hygiene. */
export const baseConfig = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'smart'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
    },
  },
  {
    files: [
      '**/*.{test,spec}.{ts,tsx}',
      '**/scripts/**/*.{js,mjs,cjs,ts}',
      '**/vitest.config.ts',
      '**/vite.config.ts',
      '**/eslint.config.*',
    ],
    rules: {
      'no-console': 'off',
    },
  },
];

export default baseConfig;
