import { describe, expect, it } from 'vitest';
import { convertFromBase, formatMoney } from './markets';

describe('formatMoney', () => {
  it('formats Singapore market in SGD', () => {
    const formatted = formatMoney(10, 'singapore');
    expect(formatted).toMatch(/13\.50/);
    expect(convertFromBase(10, 'singapore')).toBe(13.5);
  });

  it('converts Korea market to whole KRW', () => {
    expect(convertFromBase(10, 'south_korea')).toBe(13_500);
    expect(formatMoney(10, 'south_korea')).toMatch(/₩|KRW/);
  });

  it('converts Indonesia market to whole IDR', () => {
    expect(convertFromBase(10, 'indonesia')).toBe(160_000);
  });
});
