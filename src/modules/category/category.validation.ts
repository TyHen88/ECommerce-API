import { z } from "zod";

// Enhanced schemas with descriptions for auto-generated docs
export const createCategoryBodySchema = z.object({
  name: z.string().min(1, "Category name is required").describe("Category name"),
  description: z.string().optional(),
});

export const updateCategoryBodySchema = z.object({
  name: z.string().min(1).optional().describe("Category name"),
  description: z.string().optional(),
});

export const categoryParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").describe("Category ID"),
});

// Wrapper schemas for middleware validation
export const createCategorySchema = z.object({
  body: createCategoryBodySchema,
});

export const updateCategorySchema = z.object({
  body: updateCategoryBodySchema,
  params: categoryParamsSchema,
});

export const getCategorySchema = z.object({
  params: categoryParamsSchema,
});

export const deleteCategorySchema = z.object({
  params: categoryParamsSchema,
});

