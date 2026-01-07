import { z } from "zod";
import { OrderStatus } from "@prisma/client";

// Enhanced schemas with descriptions for auto-generated docs
export const createOrderBodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive().describe("Product ID"),
        quantity: z.number().int().positive().min(1).describe("Quantity to order"),
      })
    )
    .min(1, "Order must contain at least one item")
    .describe("Array of items to order"),
});

export const updateOrderStatusBodySchema = z.object({
  status: z.nativeEnum(OrderStatus).describe("New order status"),
});

export const orderParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").describe("Order ID"),
});

// Wrapper schemas for middleware validation
export const createOrderSchema = z.object({
  body: createOrderBodySchema,
});

export const getOrderSchema = z.object({
  params: orderParamsSchema,
});

export const updateOrderStatusSchema = z.object({
  params: orderParamsSchema,
  body: updateOrderStatusBodySchema,
});

