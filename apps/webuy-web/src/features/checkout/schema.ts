import { z } from 'zod';

export const localOrderItemSchema = z.object({
  productId: z.number(),
  title: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

export const localOrderSchema = z.object({
  id: z.string(),
  status: z.literal('success'),
  currency: z.enum(['SGD', 'KRW', 'IDR']),
  amount: z.number(),
  baseTotal: z.number(),
  locale: z.enum(['en', 'ko', 'id']),
  customerName: z.string(),
  address: z.string(),
  city: z.string(),
  items: z.array(localOrderItemSchema),
  createdAt: z.string(),
});

export const checkoutFormSchema = z.object({
  customerName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
});

export type LocalOrder = z.infer<typeof localOrderSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
