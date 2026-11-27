import { describe, expect, it } from 'vitest';
import {
  parsePresentUi,
  parseUiBlocks,
  presentUiSchema,
  uiBlockSchema,
} from './schema';

describe('assistant ui catalog schema', () => {
  it('accepts a full present_ui payload', () => {
    const payload = {
      blocks: [
        { type: 'text', content: 'Here are affordable picks:' },
        {
          type: 'productCards',
          products: [
            {
              id: 1,
              reason: 'Lowest price',
            },
          ],
        },
        {
          type: 'button',
          label: 'Search mascara',
          action: { kind: 'navigate', href: '/en/search?q=mascara' },
        },
        {
          type: 'accordion',
          items: [{ title: 'Why these?', content: 'Best price-to-rating balance.' }],
        },
        {
          type: 'chips',
          items: [{ label: 'Under $20', message: 'Show products under $20' }],
        },
      ],
    };

    expect(presentUiSchema.safeParse(payload).success).toBe(true);
    expect(parseUiBlocks(payload)).toHaveLength(5);
  });

  it('rejects unknown block types', () => {
    const result = uiBlockSchema.safeParse({
      type: 'markdown',
      content: '# hi',
    });
    expect(result.success).toBe(false);
  });

  it('rejects absolute navigate hrefs', () => {
    const result = uiBlockSchema.safeParse({
      type: 'button',
      label: 'Leave',
      action: { kind: 'navigate', href: 'https://evil.example' },
    });
    expect(result.success).toBe(false);
  });

  it('returns null for invalid present_ui payloads', () => {
    expect(parsePresentUi({ blocks: [] })).toBeNull();
    expect(parsePresentUi({ blocks: [{ type: 'text' }] })).toBeNull();
  });

  it('accepts sendMessage button actions', () => {
    const result = uiBlockSchema.safeParse({
      type: 'button',
      label: 'Cheaper',
      variant: 'secondary',
      action: { kind: 'sendMessage', message: 'Show cheaper options' },
    });
    expect(result.success).toBe(true);
  });
});
