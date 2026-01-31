import redisClient, { isRedisAvailable } from "../../config/redis";
import { NotFoundError } from "../../shared/errors/app.error";
import * as repo from "./product.repository";

const CACHE_TTL = 3600; // 1 hour

export const createProduct = async (payload: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
}) => {
  return repo.create(payload);
};

export const getProducts = async () => {
  const cacheKey = "products:list";

  if (isRedisAvailable) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }

  const products = await repo.findAll();

  if (isRedisAvailable) {
    try {
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(products));
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }

  return products;
};

export const getProductById = async (id: number) => {
  const cacheKey = `products:${id}`;

  if (isRedisAvailable) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }

  const product = await repo.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (isRedisAvailable) {
    try {
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(product));
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }

  return product;
};

export const updateProduct = async (
  id: number,
  payload: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
  }
) => {
  const existingProduct = await repo.findById(id);
  if (!existingProduct) {
    throw new NotFoundError("Product not found");
  }

  const updated = await repo.update(id, payload);

  if (isRedisAvailable) {
    try {
      await redisClient.del(`products:${id}`);
      await redisClient.del("products:list");
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }

  return updated;
};

export const deleteProduct = async (id: number) => {
  const existingProduct = await repo.findById(id);
  if (!existingProduct) {
    throw new NotFoundError("Product not found");
  }

  await repo.remove(id);

  if (isRedisAvailable) {
    try {
      await redisClient.del(`products:${id}`);
      await redisClient.del("products:list");
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }
};
