import { Category, Prisma, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany({
    include: {
      products: true,
    },
  });
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const createCategory = async (
  data: Prisma.CategoryCreateInput
): Promise<Category> => {
  return prisma.category.create({ data });
};

export const deleteCategory = async (id: number): Promise<Category | null> => {
  try {
    return await prisma.category.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null;
    }
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  data: Prisma.CategoryUpdateInput
): Promise<Category | null> => {
  return prisma.category.update({
    where: { id },
    data,
  });
};
