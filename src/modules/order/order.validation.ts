import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          quantity: z.number().int().positive().min(1),
        })
      )
      .min(1, "Order must contain at least one item"),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  }),
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
});

