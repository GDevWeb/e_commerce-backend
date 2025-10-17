import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { UnauthorizedError } from "../../../errors";
import { PrismaClient } from "../../../generated/prisma";
import { UserProfile } from "../../../types/user.types";
import { handlePrismaError } from "../../../utils/handlePrismaError";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.utils";
import { AuthResponse } from "../authResponse.types";
import {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../schema/auth.schema";

dotenv.config();

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS as string;
console.log(BCRYPT_ROUNDS);

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  try {
    const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

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

    // Storing refresh token in DB
    await saveRefreshToken(newUser.id, refreshToken);

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

  // Optional but important fro security Deleting the older tokens
  await prisma.refreshToken.deleteMany({ where: { id: user.id } });
  // Limiting the number of active sessions
  await saveRefreshToken(user.id, refreshToken);

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

export const getProfile = async (userId: number): Promise<UserProfile> => {
  const user = await prisma.customer.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      address: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: number,
  data: UpdateProfileInput
): Promise<UserProfile> => {
  const user = await prisma.customer.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  const updatedUser = await prisma.customer.update({
    where: { id: userId },
    data: data,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      address: true,
    },
  });

  return updatedUser;
};

export const saveRefreshToken = async (
  userId: number,
  token: string
): Promise<void> => {
  /*Calculate the expiration date*/
  //  1. retrieving the JWT_REFRESH_EXPIRES_IN from env ("30d" for example)
  const expirationDate = (process.env.BCRYPT_ROUNDS as string) || "30d";
  console.info("expirationDate:", expirationDate);
  // 2. Convert in timestamp (now + 30 days)
  const timestamp = new Date(
    Date.now() + parseInt(expirationDate) * 24 * 60 * 60 * 100
  );
  console.info("timestamp:", timestamp);
  // 3. Create an DateObject
  const expiresAt = new Date(timestamp);
  console.info("expireAt:", expiresAt);
  /*Storing in the DB*/
  //  1. prisma.refreshToken.create()
  await prisma.refreshToken.create({
    // 2. data: token, userId, expireAt
    data: {
      token: token,
      userId: userId,
      expiresAt: expiresAt,
    },
  });
};
