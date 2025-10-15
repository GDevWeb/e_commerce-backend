import { Prisma, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      customer: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const getOrderById = async (id: number) => {
  return prisma.order.findUniqueOrThrow({
    where: { id },
    include: {
      customer: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const createOrder = async (data: Prisma.OrderCreateInput) => {
  return prisma.order.create({ data });
};

export const updateOrder = async (
  id: number,
  data: Prisma.OrderUpdateInput
) => {
  return prisma.order.update({
    where: { id },
    data,
  });
};

export const deleteOrder = async (id: number) => {
  return prisma.order.delete({ where: { id } });
};
