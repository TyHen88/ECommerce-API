import { z } from "zod";

// Enhanced schemas with descriptions for auto-generated docs
export const registerBodySchema = z.object({
  email: z.string().email("Invalid email format").describe("User's email address"),
  password: z.string().min(6, "Password must be at least 6 characters").describe("User's password (minimum 6 characters)"),
  firstName: z.string().min(1, "First name is required").describe("User's first name"),
  lastName: z.string().min(1, "Last name is required").describe("User's last name"),
});

export const loginBodySchema = z.object({
  email: z.string().email("Invalid email format").describe("User's email address"),
  password: z.string().min(1, "Password is required").describe("User's password"),
});

// Wrapper schemas for middleware validation
export const registerSchema = z.object({
  body: registerBodySchema,
});

export const loginSchema = z.object({
  body: loginBodySchema,
});

