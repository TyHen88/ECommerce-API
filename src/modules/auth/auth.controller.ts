import { Request, Response } from "express";
import * as authService from "./auth.service";
import { sendSuccess } from "../../shared/utils/response.util";

export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return sendSuccess(res, result, "User registered successfully", 201);
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);
  return sendSuccess(res, result, "Login successful");
};

