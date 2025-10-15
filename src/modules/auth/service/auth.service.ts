import bcrypt from "bcrypt";
import { UnauthorizedError } from "../../../errors";
import { PrismaClient } from "../../../generated/prisma";
import { handlePrismaError } from "../../../utils/handlePrismaError";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.utils";
import { AuthResponse } from "../authResponse.types";
import { LoginInput, RegisterInput } from "../schema/auth.schema";

const prisma = new PrismaClient();
export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  try {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser = await prisma.customer.create({
      data: {
        email: input.email,
        password: hashedPassword,
        first_name: input.first_name,
        last_name: input.last_name,
      },
    });

    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const refreshToken = generateRefreshToken(newUser.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    };
  } catch (error) {
    handlePrismaError(error);
  }
  throw new Error("Failed to register user");
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await prisma.customer.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.password) {
    throw new UnauthorizedError("Account has no password set");
  }

  const isValidPassword = await bcrypt.compare(
    input.password,
    user.password as string
  );

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id, user.email);
  const refreshToken = generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  };
};
