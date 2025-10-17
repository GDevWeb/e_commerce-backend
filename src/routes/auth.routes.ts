import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import {
  getProfile,
  login,
  refreshToken,
  register,
  updateProfile,
} from "../modules/auth/controller/auth.controller";
import {
  LoginSchema,
  RegisterSchema,
  UpdateProfileSchema,
} from "../modules/auth/schema/auth.schema";
import { RefreshTokenSchema } from "../schemas/auth.refresh.schema";

// ✅ AJOUTE CES LOGS ICI
console.log("=== DEBUG SCHEMAS ===");
console.log("RefreshTokenSchema defined?", RefreshTokenSchema !== undefined);
console.log("=== FIN DEBUG ===");

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

authRouter.post("/refresh", validate(RefreshTokenSchema), refreshToken);
// authRouter.post("/refresh", refreshToken);

export default authRouter;
