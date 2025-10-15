import bcrypt from "bcrypt";
import { ConflictError, UnauthorizedError } from "../../../errors";
import { PrismaClient } from "../../../generated/prisma";
import { handlePrismaError } from "../../../utils/handlePrismaError";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.utils";
import { AuthResponse } from "../authResponse.types";
import { LoginInput, RegisterInput } from "../schema/auth.schema";

const prisma = new PrismaClient();

export const register = async (
  input: RegisterInput
): Promise<AuthResponse | undefined> => {
  //fix any
  try {
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: input.email },
    });

    if (existingCustomer) {
      throw new ConflictError("Customer with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
      input.password,
      process.env.BCRYPT_ROUNDS as string
    );

    const customer = await prisma.customer.create({
      data: {
        ...input,
        password: hashedPassword,
        phone_number: "",
        address: "",
      },
    });

    const accessToken = generateAccessToken(customer.id, customer.email);
    const refreshToken = generateRefreshToken(customer.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
      },
    };
  } catch (error) {
    handlePrismaError(error);
    return undefined;
  }
};

export const login = async (
  data: LoginInput
): Promise<AuthResponse | undefined> => {
  try {
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email },
    });
    if (!existingCustomer) {
      throw new UnauthorizedError("Invalid credentials");
    }
    const comparePassword = await bcrypt.compare(
      data.password,
      existingCustomer.password as string
    );

    if (!comparePassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = generateAccessToken(
      existingCustomer.id,
      existingCustomer.email
    );
    const refreshToken = generateRefreshToken(existingCustomer.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: existingCustomer.id,
        email: existingCustomer.email,
        first_name: existingCustomer.first_name,
        last_name: existingCustomer.last_name,
      },
    };
  } catch (error) {
    handlePrismaError(error);
    return undefined;
  }
};

export const logout = () => {};
