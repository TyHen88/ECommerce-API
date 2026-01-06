import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "E-commerce API",
    version: "1.0.0",
    description: "Production-ready E-commerce REST API with Node.js, Express, TypeScript, and Prisma",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                },
                required: ["email", "password", "firstName", "lastName"],
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Bad request" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",
        responses: {
          "200": { description: "Products retrieved successfully" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a new product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock: { type: "number" },
                  categoryId: { type: "number" },
                },
                required: ["name", "price", "stock"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Product created successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Product retrieved successfully" },
          "404": { description: "Product not found" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Product updated successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Product deleted successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get all categories",
        responses: {
          "200": { description: "Categories retrieved successfully" },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a new category",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Category created successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create a new order",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        productId: { type: "number" },
                        quantity: { type: "number" },
                      },
                    },
                  },
                },
                required: ["items"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Order created successfully" },
          "400": { description: "Bad request" },
          "401": { description: "Unauthorized" },
        },
      },
      get: {
        tags: ["Orders"],
        summary: "Get all orders",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Orders retrieved successfully" },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

