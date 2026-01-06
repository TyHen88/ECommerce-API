import { Response } from "express";
import { AuthRequest } from "../../shared/types/express.types";
import * as service from "./order.service";
import { sendSuccess } from "../../shared/utils/response.util";

export const create = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new Error("User not authenticated");
  }
  const order = await service.createOrder(req.user.id, req.body.items);
  return sendSuccess(res, order, "Order created successfully", 201);
};

export const findAll = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.role === "ADMIN" ? undefined : req.user?.id;
  const orders = await service.getOrders(userId);
  return sendSuccess(res, orders, "Orders retrieved successfully");
};

export const findOne = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new Error("User not authenticated");
  }
  const userId = req.user.role === "ADMIN" ? undefined : req.user.id;
  const order = await service.getOrderById(Number(req.params.id), userId);
  return sendSuccess(res, order, "Order retrieved successfully");
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  const order = await service.updateOrderStatus(
    Number(req.params.id),
    req.body.status
  );
  return sendSuccess(res, order, "Order status updated successfully");
};

