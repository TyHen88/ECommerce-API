import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { UnauthorizedError, BadRequestError } from "../../shared/errors/app.error";
import * as userRepo from "../user/user.repository";

export const register = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const existingUser = await userRepo.findByEmail(data.email);
  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await userRepo.create({
    ...data,
    password: hashedPassword,
  });

  const token = generateToken(user.id, user.email, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    token,
  };
};

export const login = async (email: string, password: string) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = generateToken(user.id, user.email, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    token,
  };
};

export const generateToken = (userId: number, email: string, role: string): string => {
  return jwt.sign({ userId, email, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const verifyToken = (token: string): { userId: number; email: string; role: string } => {
  try {
    return jwt.verify(token, env.jwtSecret) as { userId: number; email: string; role: string };
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

