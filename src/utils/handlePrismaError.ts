import { Response } from "express";
import { Prisma } from "../generated/prisma";

export const handlePrismaError = (error: unknown, res: Response): boolean => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 - Unique constraint
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[]) || [];
      res.status(409).json({
        status: "error",
        message: `A record with this ${target.join(", ")} already exists`,
      });
      return true;
    }

    // P2025 - Record not found
    if (error.code === "P2025") {
      res.status(404).json({
        status: "error",
        message: "Record not found",
      });
      return true;
    }

    // P2003 - Foreign key constraint
    if (error.code === "P2003") {
      res.status(400).json({
        status: "error",
        message: "Invalid relation",
      });
      return true;
    }
  }

  return false;
};
