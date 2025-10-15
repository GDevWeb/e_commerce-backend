import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import * as authService from "../service/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const authResponse = await authService.register(req.body);
  res.status(201).json(authResponse);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const authResponse = await authService.login(req.body);
  res.status(200).json(authResponse);
});
