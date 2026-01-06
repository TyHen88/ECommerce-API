import { Request, Response } from "express";
import * as service from "./category.service";
import { sendSuccess } from "../../shared/utils/response.util";

export const create = async (req: Request, res: Response) => {
  const category = await service.createCategory(req.body);
  return sendSuccess(res, category, "Category created successfully", 201);
};

export const findAll = async (_: Request, res: Response) => {
  const categories = await service.getCategories();
  return sendSuccess(res, categories, "Categories retrieved successfully");
};

export const findOne = async (req: Request, res: Response) => {
  const category = await service.getCategoryById(Number(req.params.id));
  return sendSuccess(res, category, "Category retrieved successfully");
};

export const update = async (req: Request, res: Response) => {
  const category = await service.updateCategory(Number(req.params.id), req.body);
  return sendSuccess(res, category, "Category updated successfully");
};

export const remove = async (req: Request, res: Response) => {
  await service.deleteCategory(Number(req.params.id));
  return sendSuccess(res, null, "Category deleted successfully");
};

