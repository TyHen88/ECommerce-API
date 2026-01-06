import * as authService from "./auth.service";
import * as userRepo from "../user/user.repository";
import { UnauthorizedError, BadRequestError } from "../../shared/errors/app.error";
import bcrypt from "bcrypt";

jest.mock("../user/user.repository");
jest.mock("bcrypt");

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      };

      (userRepo.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (userRepo.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        password: "hashedPassword",
        role: "CUSTOMER",
      });

      const result = await authService.register(userData);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    });

    it("should throw error if user already exists", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      };

      (userRepo.findByEmail as jest.Mock).mockResolvedValue({ id: 1, email: userData.email });

      await expect(authService.register(userData)).rejects.toThrow(BadRequestError);
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const email = "test@example.com";
      const password = "password123";
      const hashedPassword = "hashedPassword";

      (userRepo.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
        firstName: "Test",
        lastName: "User",
        role: "CUSTOMER",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(email, password);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it("should throw error for invalid email", async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login("test@example.com", "password")).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should throw error for invalid password", async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login("test@example.com", "wrongpassword")).rejects.toThrow(
        UnauthorizedError
      );
    });
  });
});

