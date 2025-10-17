import bcrypt from "bcrypt";
import dotenv from "dotenv";
import ms from "ms";
import { UnauthorizedError } from "../../../errors";
import { PrismaClient } from "../../../generated/prisma";
import { UserProfile } from "../../../types/user.types";
import { handlePrismaError } from "../../../utils/handlePrismaError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../../utils/jwt.utils";
import { AuthResponse } from "../authResponse.types";
import {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../schema/auth.schema"; // Removed unused 'error' import

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
  const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "30d";
  console.info("jwtRefreshExpiresIn:", jwtRefreshExpiresIn);

  const milliseconds = ms(jwtRefreshExpiresIn as ms.StringValue);
  const expiresAt = new Date(Date.now() + milliseconds);

  console.info("Saving refresh token, expires at:", expiresAt);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

export const refreshTokenAccess = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken?: string }> => {
  /*STEP 1: Verify that the token exists in the DB */
  // 1. Search in the RefreshToken table
  const existingRefreshToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  // 2. If not found: throw UnauthorizedError("Invalid refresh token")
  if (!existingRefreshToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  /*STEP 2: Check expiration*/
  // 3. Compare storedToken.expiresAt with Date.now()
  const storedToken = existingRefreshToken.expiresAt;
  console.info("storedToken value:", storedToken);

  const today = new Date(Date.now());

  const compare = storedToken.getTime() < today.getTime();
  // 4. If expired:
  if (compare) {
    //    - Delete the token from the DB (cleanup)
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
    //    - throw UnauthorizedError("Refresh token expired")
    throw new UnauthorizedError("Refresh token expired");
  }

  /*STEP 3: Verify JWT signature */
  // 5. Call verifyToken(refreshToken, true)
  try {
    const isValidToken = verifyToken(refreshToken, true);
    /*STEP 4: Extract and validate the user */
    // 7. Extract userId from the JWT payload
    const user = isValidToken.userId;
    // 8. Verify that the user still exists
    const existingUser = await prisma.customer.findUnique({
      where: { id: user },
    });
    // 9. If not found: throw UnauthorizedError("User not found")
    if (!existingUser) {
      throw new UnauthorizedError("User not found");
    }
    /*STEP 5: Generate a new access token*/
    // 10. Call generateAccessToken(user.id, user.email)
    const newAccessToken = generateAccessToken(
      existingUser.id,
      existingUser.email
    );

    //   STEP 6 (OPTIONAL): Token Rotation
    // 11. Delete the old refresh token
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
    // 12. Generate a NEW refresh token
    const newRefreshToken = generateRefreshToken(existingUser.id);
    // 13. Store the new one
    await saveRefreshToken(existingUser.id, newRefreshToken);
    /*STEP 7: Return the tokens*/
    // 15. With rotation: { accessToken, refreshToken: newRefreshToken }
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new UnauthorizedError("Invalid refresh token");
  }
};
