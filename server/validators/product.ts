import { z } from "zod";

export const ProductItemSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
});

export const AddProductsToAccountSchema = z.object({
  accountId: z.string().length(24),
  products: z.array(ProductItemSchema).min(1),
});

export type AddProductsToAccountType = z.infer<typeof AddProductsToAccountSchema>;