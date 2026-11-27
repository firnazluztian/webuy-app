import { z } from 'zod';

const appRelativeHref = z
  .string()
  .min(1)
  .refine((value) => value.startsWith('/'), {
    message: 'href must be an app-relative path starting with /',
  });

export const navigateActionSchema = z.object({
  kind: z.literal('navigate'),
  href: appRelativeHref,
});

export const sendMessageActionSchema = z.object({
  kind: z.literal('sendMessage'),
  message: z.string().min(1),
});

export const buttonActionSchema = z.discriminatedUnion('kind', [
  navigateActionSchema,
  sendMessageActionSchema,
]);

export const textBlockSchema = z.object({
  type: z.literal('text'),
  content: z.string().min(1),
});

export const buttonBlockSchema = z.object({
  type: z.literal('button'),
  label: z.string().min(1),
  action: buttonActionSchema,
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).optional(),
});

/** Agent only supplies catalog ids (+ optional reason). The client hydrates media/price. */
export const productSuggestionSchema = z.object({
  id: z.number().int().positive(),
  reason: z.string().optional(),
});

export const productCardsBlockSchema = z.object({
  type: z.literal('productCards'),
  products: z.array(productSuggestionSchema).min(1).max(6),
});

export const accordionBlockSchema = z.object({
  type: z.literal('accordion'),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .min(1)
    .max(8),
});

export const chipsBlockSchema = z.object({
  type: z.literal('chips'),
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        message: z.string().min(1),
      }),
    )
    .min(1)
    .max(8),
});

export const uiBlockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  buttonBlockSchema,
  productCardsBlockSchema,
  accordionBlockSchema,
  chipsBlockSchema,
]);

export const presentUiSchema = z.object({
  blocks: z.array(uiBlockSchema).min(1).max(20),
});

export type NavigateAction = z.infer<typeof navigateActionSchema>;
export type SendMessageAction = z.infer<typeof sendMessageActionSchema>;
export type ButtonAction = z.infer<typeof buttonActionSchema>;
export type TextBlock = z.infer<typeof textBlockSchema>;
export type ButtonBlock = z.infer<typeof buttonBlockSchema>;
export type ProductSuggestion = z.infer<typeof productSuggestionSchema>;
export type ProductCardsBlock = z.infer<typeof productCardsBlockSchema>;
export type AccordionBlock = z.infer<typeof accordionBlockSchema>;
export type ChipsBlock = z.infer<typeof chipsBlockSchema>;
export type UiBlock = z.infer<typeof uiBlockSchema>;
export type PresentUiPayload = z.infer<typeof presentUiSchema>;

export function parsePresentUi(raw: unknown): PresentUiPayload | null {
  const result = presentUiSchema.safeParse(raw);
  return result.success ? result.data : null;
}

export function parseUiBlocks(raw: unknown): UiBlock[] {
  return parsePresentUi(raw)?.blocks ?? [];
}
