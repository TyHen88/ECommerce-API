import { Router } from "express";
import * as controller from "./product.controller";
import { validate } from "../../shared/middleware/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema,
} from "./product.validation";
import { authenticate, authorize } from "../auth/auth.middleware";

const router = Router();

router.get("/", controller.findAll);
router.get("/:id", validate(getProductSchema), controller.findOne);
router.post("/", authenticate, authorize("ADMIN"), validate(createProductSchema), controller.create);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updateProductSchema), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validate(deleteProductSchema), controller.remove);

export default router;
