import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomeCta } from './home-cta';

describe('HomeCta', () => {
  it('renders the kiichan primary button', () => {
    render(<HomeCta />);
    expect(screen.getByRole('button', { name: /shop now/i })).toBeTruthy();
  });
});
