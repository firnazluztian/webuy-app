import { describe, expect, it } from 'vitest';
import { convertFromBase, formatMoney } from './markets';

describe('formatMoney', () => {
  it('formats Singapore market in SGD', () => {
    const formatted = formatMoney(10, 'en');
    expect(formatted).toMatch(/13\.50/);
    expect(convertFromBase(10, 'en')).toBe(13.5);
  });

  it('converts Korea market to whole KRW', () => {
    expect(convertFromBase(10, 'ko')).toBe(13_500);
    expect(formatMoney(10, 'ko')).toMatch(/₩|KRW/);
  });

  it('converts Indonesia market to whole IDR', () => {
    expect(convertFromBase(10, 'id')).toBe(160_000);
  });
});
