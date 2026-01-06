import prisma from "../../config/database";

export const create = (data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
}) => {
  return prisma.product.create({
    data,
    include: {
      category: true,
    },
  });
};

export const findAll = () => {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findById = (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const update = (
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
  }
) => {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

export const remove = (id: number) => {
  return prisma.product.delete({
    where: { id },
  });
};
