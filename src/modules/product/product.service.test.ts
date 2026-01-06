import * as productService from "./product.service";
import * as productRepo from "./product.repository";
import { NotFoundError } from "../../shared/errors/app.error";
import redisClient from "../../config/redis";

jest.mock("./product.repository");
jest.mock("../../config/redis");

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProductById", () => {
    it("should return product from cache if available", async () => {
      const product = { id: 1, name: "Test Product", price: 100 };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(product));

      const result = await productService.getProductById(1);

      expect(result).toEqual(product);
      expect(productRepo.findById).not.toHaveBeenCalled();
    });

    it("should fetch from database and cache if not in cache", async () => {
      const product = { id: 1, name: "Test Product", price: 100 };
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (productRepo.findById as jest.Mock).mockResolvedValue(product);
      (redisClient.setEx as jest.Mock).mockResolvedValue(undefined);

      const result = await productService.getProductById(1);

      expect(result).toEqual(product);
      expect(productRepo.findById).toHaveBeenCalledWith(1);
      expect(redisClient.setEx).toHaveBeenCalled();
    });

    it("should throw NotFoundError if product not found", async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (productRepo.findById as jest.Mock).mockResolvedValue(null);

      await expect(productService.getProductById(999)).rejects.toThrow(NotFoundError);
    });
  });
});

