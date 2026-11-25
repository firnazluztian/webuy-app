import { baseConfig } from './base.js';

/**
 * Shared Next overlays. Apps should compose with `eslint-config-next` via FlatCompat
 * from the app directory (so `next` resolves correctly). See `apps/webuy-web/eslint.config.mjs`.
 */
export const nextOverlay = {
  rules: {
    'no-console': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};

export { baseConfig };

export default [...baseConfig, nextOverlay];
