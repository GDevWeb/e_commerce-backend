import { Prisma, PrismaClient, Product } from "../generated/prisma";

const prisma = new PrismaClient();

export const getAllProducts = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Product[]> => {
  const skip = (page - 1) * pageSize;
  return prisma.product.findMany({
    include: {
      category: true,
      brand: true,
    },
    skip,
    take: pageSize,
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

/* ***Searching and Filtering ***/

// const searchingProduct = (
//   req: Request,
//   res: Response
// ): Promise<Product | null> => {};
