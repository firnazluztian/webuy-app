import { describe, expect, it } from 'vitest';
import { routeMetadata } from '@/lib/route-metadata';

describe('routeMetadata', () => {
  it('returns a localized title for a known locale', async () => {
    await expect(routeMetadata('en', (messages) => messages.cart.title)).resolves.toEqual({
      title: 'Your cart',
    });
  });

  it('returns empty metadata for an unknown locale', async () => {
    await expect(routeMetadata('xx', (messages) => messages.cart.title)).resolves.toEqual({});
  });

  it('supports titles resolved asynchronously', async () => {
    await expect(
      routeMetadata('ko', async (messages) => `${messages.order.title} 12`),
    ).resolves.toEqual({ title: '주문 12' });
  });
});
