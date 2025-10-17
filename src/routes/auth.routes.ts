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
  RefreshTokenSchema,
  RegisterSchema,
  UpdateProfileSchema,
} from "../modules/auth/schema/auth.schema";

// ✅ AJOUTE CES LOGS ICI
console.log("=== DEBUG SCHEMAS ===");
console.log("RegisterSchema:", RegisterSchema);
console.log("LoginSchema:", LoginSchema);
console.log("UpdateProfileSchema:", UpdateProfileSchema);
console.log("RefreshTokenSchema:", RefreshTokenSchema);
console.log("Type of RefreshTokenSchema:", typeof RefreshTokenSchema);
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

// authRouter.post("/refresh", validate(RefreshTokenSchema), refreshToken);
authRouter.post("/refresh", refreshToken);

export default authRouter;
