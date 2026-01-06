import { Router } from "express";
import productRoutes from "./modules/product/product.routes";
import categoryRoutes from "./modules/category/category.routes";
import orderRoutes from "./modules/order/order.routes";
import authRoutes from "./modules/auth/auth.routes";
import { authLimiter } from "./shared/middleware/security.middleware";

const router = Router();

// Auth routes with stricter rate limiting
router.use("/auth", authLimiter, authRoutes);

// Protected routes
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);

export default router;
