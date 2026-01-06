import { Router } from "express";
import * as controller from "./auth.controller";
import { validate } from "../../shared/middleware/validation.middleware";
import { registerSchema, loginSchema } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);

export default router;

