import { Request, Response } from "express";
import * as service from "./product.service";
import { sendSuccess } from "../../shared/utils/response.util";

export const create = async (req: Request, res: Response) => {
  const product = await service.createProduct(req.body);
  return sendSuccess(res, product, "Product created successfully", 201);
};

export const findAll = async (_: Request, res: Response) => {
  const products = await service.getProducts();
  return sendSuccess(res, products, "Products retrieved successfully");
};

export const findOne = async (req: Request, res: Response) => {
  const product = await service.getProductById(Number(req.params.id));
  return sendSuccess(res, product, "Product retrieved successfully");
};

export const update = async (req: Request, res: Response) => {
  const product = await service.updateProduct(Number(req.params.id), req.body);
  return sendSuccess(res, product, "Product updated successfully");
};

export const remove = async (req: Request, res: Response) => {
  await service.deleteProduct(Number(req.params.id));
  return sendSuccess(res, null, "Product deleted successfully");
};
