import * as repo from "./category.repository";
import { NotFoundError } from "../../shared/errors/app.error";

export const createCategory = async (data: { name: string; description?: string }) => {
  return repo.create(data);
};

export const getCategories = async () => {
  return repo.findAll();
};

export const getCategoryById = async (id: number) => {
  const category = await repo.findById(id);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return category;
};

export const updateCategory = async (
  id: number,
  data: { name?: string; description?: string }
) => {
  const existingCategory = await repo.findById(id);
  if (!existingCategory) {
    throw new NotFoundError("Category not found");
  }
  return repo.update(id, data);
};

export const deleteCategory = async (id: number) => {
  const existingCategory = await repo.findById(id);
  if (!existingCategory) {
    throw new NotFoundError("Category not found");
  }
  await repo.remove(id);
};

