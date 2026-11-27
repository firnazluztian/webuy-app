import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { BRAND_NAME } from '@/config/brand';
import { presentUiSchema } from '@/features/assistant/schema';
import {
  fetchProduct,
  fetchProducts,
  fetchSearch,
} from '@/lib/client-api';

function toToolProduct(product: {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating?: number;
  category?: string;
  brand?: string;
  description: string;
  discountPercentage?: number;
  stock?: number;
}) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    rating: product.rating,
    category: product.category,
    brand: product.brand,
    description: product.description.slice(0, 280),
    discountPercentage: product.discountPercentage,
    stock: product.stock,
  };
}

export function createAssistantTools(): ToolSet {
  return {
    search_products: tool({
      description:
        `Search the ${BRAND_NAME} catalog by keyword. Use before recommending products.`,
      inputSchema: z.object({
        query: z.string().describe('Search query, e.g. "laptop" or "cheap beauty"'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .describe('Max products to return (default 8)'),
      }),
      execute: async ({ query, limit = 8 }) => {
        const products = await fetchSearch(query);
        return {
          query,
          products: products.slice(0, limit).map(toToolProduct),
        };
      },
    }),

    get_product: tool({
      description: 'Fetch a single product by numeric id for details.',
      inputSchema: z.object({
        id: z.number().int().positive().describe('Product id'),
      }),
      execute: async ({ id }) => {
        const product = await fetchProduct(id);
        return toToolProduct(product);
      },
    }),

    list_products: tool({
      description:
        'List catalog products when the shopper has no specific keyword (e.g. cheapest overall).',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(24).optional(),
        skip: z.number().int().min(0).optional(),
      }),
      execute: async ({ limit = 12, skip = 0 }) => {
        const products = await fetchProducts(limit, skip);
        return {
          products: products.map(toToolProduct),
        };
      },
    }),

    present_ui: tool({
      description:
        `Render the final assistant reply as trusted ${BRAND_NAME} UI blocks. Always call this to finish a turn.`,
      inputSchema: presentUiSchema,
      execute: async (input) => input,
    }),
  };
}
