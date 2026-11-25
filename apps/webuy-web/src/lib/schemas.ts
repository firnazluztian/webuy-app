import { z } from 'zod';

export const productReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
  reviewerEmail: z.string().optional(),
});

export const productDimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnail: z.string().url(),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  rating: z.number().optional(),
  stock: z.number().optional(),
  tags: z.array(z.string()).optional(),
  discountPercentage: z.number().optional(),
  availabilityStatus: z.string().optional(),
  sku: z.string().optional(),
  weight: z.number().optional(),
  dimensions: productDimensionsSchema.optional(),
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  returnPolicy: z.string().optional(),
  minimumOrderQuantity: z.number().optional(),
  reviews: z.array(productReviewSchema).optional(),
});

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  username: z.string(),
  image: z.string().optional(),
  phone: z.string().optional(),
  company: z
    .object({
      name: z.string().optional(),
      title: z.string().optional(),
    })
    .optional(),
});

export const usersResponseSchema = z.object({
  users: z.array(userSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const authUserSchema = userSchema.extend({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  gender: z.string().optional(),
});

export const cartSchema = z.object({
  id: z.number(),
  products: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      price: z.number(),
      quantity: z.number(),
      total: z.number(),
      discountPercentage: z.number().optional(),
      discountedTotal: z.number().optional(),
      thumbnail: z.string().optional(),
    })
  ),
  total: z.number(),
  discountedTotal: z.number().optional(),
  userId: z.number(),
  totalProducts: z.number().optional(),
  totalQuantity: z.number().optional(),
});

export const cartsResponseSchema = z.object({
  carts: z.array(cartSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductReview = z.infer<typeof productReviewSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type Cart = z.infer<typeof cartSchema>;
