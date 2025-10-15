import express from "express";
import { validate } from "../middlewares/validate";
import { login, register } from "../modules/auth/controller/auth.controller";
import {
  LoginSchema,
  RegisterSchema,
} from "../modules/auth/schema/auth.schema";

const authRouter = express.Router();

authRouter.post("/register", validate(RegisterSchema), register);
authRouter.post("/login", validate(LoginSchema), login);

export default authRouter;
