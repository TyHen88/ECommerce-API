import { Router } from "express";
import * as controller from "./order.controller";
import { validate } from "../../shared/middleware/validation.middleware";
import {
  createOrderSchema,
  getOrderSchema,
  updateOrderStatusSchema,
} from "./order.validation";
import { authenticate, authorize } from "../auth/auth.middleware";

const router = Router();

router.post("/", authenticate, validate(createOrderSchema), controller.create);
router.get("/", authenticate, controller.findAll);
router.get("/:id", authenticate, validate(getOrderSchema), controller.findOne);
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  validate(updateOrderStatusSchema),
  controller.updateStatus
);

export default router;

