import { Prisma, PrismaClient, Product } from "../generated/prisma";

const prisma = new PrismaClient();

export const getAllProducts = async (): Promise<Product[]> => {
  return prisma.product.findMany({
    include: {
      category: true,
    },
  });
};

export const getProductById = async (id: number): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const createProduct = async (
  data: Prisma.ProductCreateInput
): Promise<Product> => {
  return prisma.product.create({ data });
};

export const deleteProduct = async (id: number): Promise<Product | null> => {
  try {
    return await prisma.product.delete({ where: { id } });
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

export const updateProduct = async (
  id: number,
  data: Prisma.ProductUpdateInput
): Promise<Product | null> => {
  return prisma.product.update({
    where: { id },
    data,
  });
};
