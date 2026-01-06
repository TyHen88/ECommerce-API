import prisma from "../../config/database";

export const create = (data: { name: string; description?: string }) => {
  return prisma.category.create({
    data,
  });
};

export const findAll = () => {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findById = (id: number) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
      _count: {
        select: { products: true },
      },
    },
  });
};

export const update = (id: number, data: { name?: string; description?: string }) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const remove = (id: number) => {
  return prisma.category.delete({
    where: { id },
  });
};

