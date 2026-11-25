import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import { baseConfig, nextOverlay } from '@webuy/eslint-config/next';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...baseConfig,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  nextOverlay,
];

export default config;
