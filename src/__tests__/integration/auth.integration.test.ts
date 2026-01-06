import request from "supertest";
import app from "../../app";
import prisma from "../../config/database";

describe("Auth Integration Tests", () => {
  beforeAll(async () => {
    // Clean up test data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.email).toBe("test@example.com");
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "invalid-email",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      // First register a user
      await request(app).post("/api/auth/register").send({
        email: "login@example.com",
        password: "password123",
        firstName: "Login",
        lastName: "User",
      });

      // Then login
      const response = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

