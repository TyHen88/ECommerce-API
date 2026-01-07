import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { generateOpenApiDocument, RouteDefinition } from "../shared/utils/swagger.util";

// Import validation schemas
import { registerBodySchema, loginBodySchema } from "../modules/auth/auth.validation";
import { createProductBodySchema, updateProductBodySchema, productParamsSchema } from "../modules/product/product.validation";
import { createCategoryBodySchema, updateCategoryBodySchema, categoryParamsSchema } from "../modules/category/category.validation";
import { createOrderBodySchema, updateOrderStatusBodySchema, orderParamsSchema } from "../modules/order/order.validation";

// Define all API routes with their schemas
const routes: RouteDefinition[] = [
  // Authentication routes
  {
    path: "/api/auth/register",
    method: "post",
    tags: ["Authentication"],
    summary: "Register a new user",
    description: "Create a new user account with email and password",
    requestBody: registerBodySchema,
    responses: {
      "201": { description: "User registered successfully" },
      "400": { description: "Bad request - validation error" },
      "409": { description: "User already exists" },
    },
  },
  {
    path: "/api/auth/login",
    method: "post",
    tags: ["Authentication"],
    summary: "Login user",
    description: "Authenticate user and return JWT token",
    requestBody: loginBodySchema,
    responses: {
      "200": { description: "Login successful" },
      "401": { description: "Invalid credentials" },
    },
  },
  
  // Product routes
  {
    path: "/api/products",
    method: "get",
    tags: ["Products"],
    summary: "Get all products",
    description: "Retrieve a list of all available products",
    responses: {
      "200": { description: "Products retrieved successfully" },
    },
  },
  {
    path: "/api/products",
    method: "post",
    tags: ["Products"],
    summary: "Create a new product",
    description: "Create a new product (admin only)",
    security: [{ bearerAuth: [] }],
    requestBody: createProductBodySchema,
    responses: {
      "201": { description: "Product created successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden - admin access required" },
      "400": { description: "Bad request - validation error" },
    },
  },
  {
    path: "/api/products/{id}",
    method: "get",
    tags: ["Products"],
    summary: "Get product by ID",
    description: "Retrieve a specific product by its ID",
    parameters: { path: productParamsSchema },
    responses: {
      "200": { description: "Product retrieved successfully" },
      "404": { description: "Product not found" },
    },
  },
  {
    path: "/api/products/{id}",
    method: "put",
    tags: ["Products"],
    summary: "Update product",
    description: "Update an existing product (admin only)",
    security: [{ bearerAuth: [] }],
    parameters: { path: productParamsSchema },
    requestBody: updateProductBodySchema,
    responses: {
      "200": { description: "Product updated successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden - admin access required" },
      "404": { description: "Product not found" },
      "400": { description: "Bad request - validation error" },
    },
  },
  {
    path: "/api/products/{id}",
    method: "delete",
    tags: ["Products"],
    summary: "Delete product",
    description: "Delete a product (admin only)",
    security: [{ bearerAuth: [] }],
    parameters: { path: productParamsSchema },
    responses: {
      "200": { description: "Product deleted successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden - admin access required" },
      "404": { description: "Product not found" },
    },
  },

  // Category routes
  {
    path: "/api/categories",
    method: "get",
    tags: ["Categories"],
    summary: "Get all categories",
    description: "Retrieve a list of all product categories",
    responses: {
      "200": { description: "Categories retrieved successfully" },
    },
  },
  {
    path: "/api/categories",
    method: "post",
    tags: ["Categories"],
    summary: "Create a new category",
    description: "Create a new product category (admin only)",
    security: [{ bearerAuth: [] }],
    requestBody: createCategoryBodySchema,
    responses: {
      "201": { description: "Category created successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden - admin access required" },
      "400": { description: "Bad request - validation error" },
    },
  },
  {
    path: "/api/categories/{id}",
    method: "get",
    tags: ["Categories"],
    summary: "Get category by ID",
    description: "Retrieve a specific category by its ID",
    parameters: { path: categoryParamsSchema },
    responses: {
      "200": { description: "Category retrieved successfully" },
      "404": { description: "Category not found" },
    },
  },
  {
    path: "/api/categories/{id}",
    method: "put",
    tags: ["Categories"],
    summary: "Update category",
    description: "Update an existing category (admin only)",
    security: [{ bearerAuth: [] }],
    parameters: { path: categoryParamsSchema },
    requestBody: updateCategoryBodySchema,
    responses: {
      "200": { description: "Category updated successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden - admin access required" },
      "404": { description: "Category not found" },
      "400": { description: "Bad request - validation error" },
    },
  },
  {
    path: "/api/categories/{id}",
    method: "delete",
    tags: ["Categories"],
    summary: "Delete category",
    description: "Delete a category (admin only)",
    security: [{ bearerAuth: [] }],
    parameters: { path: categoryParamsSchema },
    responses: {
      "200": { description: "Category deleted successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden - admin access required" },
      "404": { description: "Category not found" },
    },
  },

  // Order routes
  {
    path: "/api/orders",
    method: "get",
    tags: ["Orders"],
    summary: "Get user orders",
    description: "Retrieve all orders for the authenticated user",
    security: [{ bearerAuth: [] }],
    responses: {
      "200": { description: "Orders retrieved successfully" },
      "401": { description: "Unauthorized" },
    },
  },
  {
    path: "/api/orders",
    method: "post",
    tags: ["Orders"],
    summary: "Create a new order",
    description: "Create a new order with specified products",
    security: [{ bearerAuth: [] }],
    requestBody: createOrderBodySchema,
    responses: {
      "201": { description: "Order created successfully" },
      "401": { description: "Unauthorized" },
      "400": { description: "Bad request - validation error or insufficient stock" },
    },
  },
  {
    path: "/api/orders/{id}",
    method: "get",
    tags: ["Orders"],
    summary: "Get order by ID",
    description: "Retrieve a specific order by its ID",
    security: [{ bearerAuth: [] }],
    parameters: { path: orderParamsSchema },
    responses: {
      "200": { description: "Order retrieved successfully" },
      "401": { description: "Unauthorized" },
      "404": { description: "Order not found" },
    },
  },
  {
    path: "/api/orders/{id}/status",
    method: "put",
    tags: ["Orders"],
    summary: "Update order status",
    description: "Update the status of an order (admin only)",
    security: [{ bearerAuth: [] }],
    parameters: { path: orderParamsSchema },
    requestBody: updateOrderStatusBodySchema,
    responses: {
      "200": { description: "Order status updated successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden - admin access required" },
      "404": { description: "Order not found" },
      "400": { description: "Bad request - validation error" },
    },
  },
];

// Generate the OpenAPI document from route definitions
const swaggerDocument = generateOpenApiDocument(routes);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

