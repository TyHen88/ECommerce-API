import * as repo from "./order.repository";
import * as productRepo from "../product/product.repository";
import { NotFoundError, BadRequestError } from "../../shared/errors/app.error";
import { stripe } from "../../config/stripe";
import { publishEvent } from "../../config/kafka";
import { OrderStatus } from "@prisma/client";

export const createOrder = async (
  userId: number,
  items: Array<{ productId: number; quantity: number }>
) => {
  if (!items || items.length === 0) {
    throw new BadRequestError("Order must contain at least one item");
  }

  // Validate products and calculate total
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await productRepo.findById(item.productId);
    if (!product) {
      throw new NotFoundError(`Product with ID ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new BadRequestError(
        `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
      );
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100), // Convert to cents
    currency: "usd",
    metadata: {
      userId: userId.toString(),
    },
  });

  // Create order
  const order = await repo.create({
    userId,
    totalAmount,
    status: "PENDING",
    paymentIntent: paymentIntent.id,
    items: orderItems,
  });

  // Update product stock
  for (const item of items) {
    const product = await productRepo.findById(item.productId);
    if (product) {
      await productRepo.update(item.productId, {
        stock: product.stock - item.quantity,
      });
    }
  }

  // Publish order-created event to Kafka
  try {
    await publishEvent("order-created", {
      orderId: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      paymentIntent: order.paymentIntent,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Failed to publish order-created event:", error);
    // Don't fail the order creation if Kafka fails
  }

  return order;
};

export const getOrders = async (userId?: number) => {
  return repo.findAll(userId);
};

export const getOrderById = async (id: number, userId?: number) => {
  const order = await repo.findById(id, userId);
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  return order;
};

export const updateOrderStatus = async (id: number, status: OrderStatus) => {
  const order = await repo.findById(id);
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  return repo.updateStatus(id, status);
};

