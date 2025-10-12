import { Customer, Prisma, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getAllCustomers = async () => {
  return prisma.customer.findMany();

  // 2nd step add pagination
  // 3rd step add filtering
};

export const getCustomerById = async (id: number): Promise<Customer | null> => {
  return prisma.customer.findUnique({
    where: { id },
  });
};

export const createCustomer = async (
  data: Prisma.CustomerCreateInput
): Promise<Customer> => {
  return prisma.customer.create({ data });
};

export const deleteCustomer = async (id: number): Promise<Customer | null> => {
  try {
    return await prisma.customer.delete({ where: { id } });
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

export const updateCustomer = async (
  id: number,
  data: Prisma.CustomerCreateInput
) => {
  try {
    return await prisma.customer.update({ where: { id }, data });
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
