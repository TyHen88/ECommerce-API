import { Router } from "express";
import * as controller from "./category.controller";
import { validate } from "../../shared/middleware/validation.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
  deleteCategorySchema,
} from "./category.validation";
import { authenticate, authorize } from "../auth/auth.middleware";

const router = Router();

router.get("/", controller.findAll);
router.get("/:id", validate(getCategorySchema), controller.findOne);
router.post("/", authenticate, authorize("ADMIN"), validate(createCategorySchema), controller.create);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updateCategorySchema), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validate(deleteCategorySchema), controller.remove);

export default router;

