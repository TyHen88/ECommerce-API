import prisma from "../../config/database";
import { UserRole } from "@prisma/client";

export const create = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}) => {
  return prisma.user.create({
    data,
  });
};

export const findByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
