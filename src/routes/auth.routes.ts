import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import {
  getProfile,
  login,
  register,
  updateProfile,
} from "../modules/auth/controller/auth.controller";
import {
  LoginSchema,
  RegisterSchema,
  UpdateProfileSchema,
} from "../modules/auth/schema/auth.schema";

const authRouter = express.Router();

authRouter.post("/register", validate(RegisterSchema), register);
authRouter.post("/login", validate(LoginSchema), login);

authRouter.get("/profile", authMiddleware, getProfile);
authRouter.patch(
  "/profile",
  authMiddleware,
  validate(UpdateProfileSchema),
  updateProfile
);

export default authRouter;
