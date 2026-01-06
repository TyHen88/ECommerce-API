import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { sendError } from "../utils/response.util";

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;
    if (prismaError.code === "P2002") {
      return sendError(res, "Duplicate entry. This record already exists.", 409);
    }
    if (prismaError.code === "P2025") {
      return sendError(res, "Record not found.", 404);
    }
  }

  // Validation errors (Zod)
  if (err.name === "ZodError") {
    const zodError = err as any;
    return sendError(
      res,
      "Validation error",
      400,
      zodError.errors?.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ")
    );
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, "Token expired", 401);
  }

  // Default error
  console.error("Error:", err);
  return sendError(
    res,
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    500
  );
};

