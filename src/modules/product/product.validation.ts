import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    stock: z.number().int().min(0, "Stock must be non-negative"),
    categoryId: z.number().int().positive().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.number().int().positive().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  }),
});

