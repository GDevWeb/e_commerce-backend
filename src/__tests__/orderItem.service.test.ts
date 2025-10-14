const prismaMock = {
  orderItem: {
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock("../generated/prisma", () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: { cause: string };
      constructor(
        message: string,
        { code, meta }: { code: string; meta?: { cause: string } }
      ) {
        super(message);
        this.code = code;
        this.meta = meta;
        this.name = "PrismaClientKnownRequestError";
      }
    },
  },
}));

import { Prisma } from "../generated/prisma";
import * as orderItemService from "../services/orderItem.service";

describe("OrderItem Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOrderItem = {
    id: 1,
    order_id: 1,
    product_id: 1,
    quantity: 2,
    price: 99.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    product: { id: 1, name: "Test Product" },
    order: { id: 1, total: 199.98 },
  };

  describe("getAllOrderItems", () => {
    it("should return all order items with their product and order", async () => {
      const mockOrderItems = [mockOrderItem];
      prismaMock.orderItem.findMany.mockResolvedValue(mockOrderItems);

      const result = await orderItemService.getAllOrderItems();

      expect(result).toEqual(mockOrderItems);
      expect(prismaMock.orderItem.findMany).toHaveBeenCalledWith({
        include: {
          product: true,
          order: true,
        },
      });
    });

    it("should return an empty array if no order items exist", async () => {
      prismaMock.orderItem.findMany.mockResolvedValue([]);

      const result = await orderItemService.getAllOrderItems();

      expect(result).toEqual([]);
      expect(prismaMock.orderItem.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getOrderItemById", () => {
    it("should return a single order item by its ID", async () => {
      prismaMock.orderItem.findUniqueOrThrow.mockResolvedValue(mockOrderItem);

      const result = await orderItemService.getOrderItemById(1);

      expect(result).toEqual(mockOrderItem);
      expect(prismaMock.orderItem.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          product: true,
          order: true,
        },
      });
    });

    it("should throw an error if the order item is not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        { code: "P2025", clientVersion: "5.x" }
      );
      prismaMock.orderItem.findUniqueOrThrow.mockRejectedValue(error);

      await expect(orderItemService.getOrderItemById(999)).rejects.toThrow(
        error
      );
    });
  });

  describe("createOrderItem", () => {
    it("should create and return a new order item", async () => {
      const newItemData = {
        order: { connect: { id: 1 } },
        product: { connect: { id: 1 } },
        quantity: 2,
        price: 99.99,
      };
      prismaMock.orderItem.create.mockResolvedValue(mockOrderItem);

      const result = await orderItemService.createOrderItem(newItemData);

      expect(result).toEqual(mockOrderItem);
      expect(prismaMock.orderItem.create).toHaveBeenCalledWith({
        data: newItemData,
      });
    });
  });

  describe("updateOrderItem", () => {
    it("should update and return the order item", async () => {
      const updateData = { quantity: 3 };
      const updatedItem = { ...mockOrderItem, quantity: 3 };
      prismaMock.orderItem.update.mockResolvedValue(updatedItem);

      const result = await orderItemService.updateOrderItem(1, updateData);

      expect(result).toEqual(updatedItem);
      expect(prismaMock.orderItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it("should throw an error if the order item to update is not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record to update not found.",
        { code: "P2025", clientVersion: "5.x" }
      );
      prismaMock.orderItem.update.mockRejectedValue(error);

      await expect(
        orderItemService.updateOrderItem(999, { quantity: 1 })
      ).rejects.toThrow(error);
    });
  });

  describe("deleteOrderItem", () => {
    it("should delete and return the order item", async () => {
      prismaMock.orderItem.delete.mockResolvedValue(mockOrderItem);

      const result = await orderItemService.deleteOrderItem(1);

      expect(result).toEqual(mockOrderItem);
      expect(prismaMock.orderItem.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw an error if the order item to delete is not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record to delete does not exist.",
        { code: "P2025", clientVersion: "5.x" }
      );
      prismaMock.orderItem.delete.mockRejectedValue(error);

      await expect(orderItemService.deleteOrderItem(999)).rejects.toThrow(
        error
      );
    });

    it("should throw an error for foreign key constraint failure", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Foreign key constraint failed",
        { code: "P2003", clientVersion: "5.x" }
      );
      prismaMock.orderItem.create.mockRejectedValue(error);

      await expect(
        orderItemService.createOrderItem({
          order: { connect: { id: 999 } },
          product: { connect: { id: 999 } },
          quantity: 1,
          price: 10,
        })
      ).rejects.toThrow(error);
    });
  });
});
