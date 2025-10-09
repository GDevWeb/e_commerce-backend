import { Brand, Prisma, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getAllBrands = async (): Promise<Brand[]> => {
  return prisma.brand.findMany({
    include: {
      products: true,
    },
  });
};

export const getBrandById = async (id: number): Promise<Brand | null> => {
  return prisma.brand.findUnique({
    where: { id },
  });
};

export const createBrand = async (
  data: Prisma.BrandCreateInput
): Promise<Brand> => {
  return prisma.brand.create({ data });
};

export const deleteBrand = async (id: number): Promise<Brand | null> => {
  try {
    return await prisma.brand.delete({ where: { id } });
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

export const updateBrand = async (
  id: number,
  data: Prisma.BrandUpdateInput
): Promise<Brand | null> => {
  return prisma.brand.update({
    where: { id },
    data,
  });
};
