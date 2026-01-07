import { z } from "zod";

// Enhanced schemas with descriptions for auto-generated docs
export const createProductBodySchema = z.object({
  name: z.string().min(1, "Product name is required").describe("Product name"),
  description: z.string().optional().describe("Product description"),
  price: z.number().positive("Price must be positive").describe("Product price in USD"),
  stock: z.number().int().min(0, "Stock must be non-negative").describe("Available stock quantity"),
  categoryId: z.number().int().positive().optional().describe("Category ID (optional)"),
});

export const updateProductBodySchema = z.object({
  name: z.string().min(1).optional().describe("Product name"),
  description: z.string().optional().describe("Product description"),
  price: z.number().positive().optional().describe("Product price in USD"),
  stock: z.number().int().min(0).optional().describe("Available stock quantity"),
  categoryId: z.number().int().positive().optional().describe("Category ID (optional)"),
});

export const productParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").describe("Product ID"),
});

// Wrapper schemas for middleware validation
export const createProductSchema = z.object({
  body: createProductBodySchema,
});

export const updateProductSchema = z.object({
  body: updateProductBodySchema,
  params: productParamsSchema,
});

export const getProductSchema = z.object({
  params: productParamsSchema,
});

export const deleteProductSchema = z.object({
  params: productParamsSchema,
});

