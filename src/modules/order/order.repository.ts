import prisma from "../../config/database";
import { OrderStatus } from "@prisma/client";

export const create = (data: {
  userId: number;
  totalAmount: number;
  status?: OrderStatus;
  paymentIntent?: string;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}) => {
  return prisma.order.create({
    data: {
      userId: data.userId,
      totalAmount: data.totalAmount,
      status: data.status || "PENDING",
      paymentIntent: data.paymentIntent,
      items: {
        create: data.items,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const findAll = (userId?: number) => {
  return prisma.order.findMany({
    where: userId ? { userId } : undefined,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findById = (id: number, userId?: number) => {
  return prisma.order.findFirst({
    where: {
      id,
      ...(userId ? { userId } : {}),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const updateStatus = (id: number, status: OrderStatus) => {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

