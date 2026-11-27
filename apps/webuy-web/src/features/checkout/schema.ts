import { z } from 'zod';

export const localOrderItemSchema = z.object({
  productId: z.number(),
  title: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  imageUrl: z.string().optional(),
});

export const localOrderSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'success', 'cancelled']),
  currency: z.enum(['SGD', 'KRW', 'IDR']),
  amount: z.number(),
  baseTotal: z.number(),
  subtotalBase: z.number().optional(),
  discountBase: z.number().optional(),
  voucherCode: z.string().optional(),
  locale: z.enum(['en', 'ko', 'id']),
  customerName: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  items: z.array(localOrderItemSchema),
  createdAt: z.string(),
  stripeSessionId: z.string().optional(),
});

export const checkoutFormSchema = z.object({
  customerName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

export type LocalOrder = z.infer<typeof localOrderSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
