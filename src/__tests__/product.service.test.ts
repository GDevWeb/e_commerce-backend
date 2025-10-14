const prismaMock = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
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
import * as productService from "../services/product.service";

describe("Products Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---

  describe("getAllProducts", () => {
    const mockProducts = [
      {
        id: 2,
        name: "Clavier Mécanique",
        sku: "CLA-50B3FFA6",
        imageUrl: "/uploads/products/keyboard-1760350958614.jpg",
        description: "Un clavier mécanique haut de gamme pour les gamers.",
        weight: 1.2,
        price: 149.99,
        stock_quantity: 44,
        category_id: 1,
        brand_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: { id: 1, name: "ELECTRONICS" },
        brand: { id: 1, name: "Logitech" },
      },
      {
        id: 3,
        name: "Souris Gamer",
        sku: "CLA-50B3FFA7",
        imageUrl: "/uploads/products/mouse-1760350958614.jpg",
        description: "Une souris ergonomique pour les gamers.",
        weight: 0.2,
        price: 79.99,
        stock_quantity: 4,
        category_id: 1,
        brand_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: { id: 1, name: "ELECTRONICS" },
        brand: { id: 1, name: "Logitech" },
      },
    ];

    test("should return all products with pagination info", async () => {
      prismaMock.product.findMany.mockResolvedValue(mockProducts);
      prismaMock.product.count.mockResolvedValue(mockProducts.length);

      const result = await productService.getAllProducts({});

      expect(result.products).toEqual(mockProducts);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: mockProducts.length,
        totalPages: 1,
      });
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: true,
          brand: true,
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
      expect(prismaMock.product.count).toHaveBeenCalledWith({ where: {} });
    });

    test("should handle empty array if no products are found", async () => {
      prismaMock.product.findMany.mockResolvedValue([]);
      prismaMock.product.count.mockResolvedValue(0);

      const result = await productService.getAllProducts({});

      expect(result.products).toEqual([]);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      });
    });

    test("should handle pagination correctly", async () => {
      prismaMock.product.findMany.mockResolvedValue([mockProducts[0]]);
      prismaMock.product.count.mockResolvedValue(mockProducts.length);

      const result = await productService.getAllProducts({
        page: 1,
        pageSize: 1,
      });

      expect(result.products).toEqual([mockProducts[0]]);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 1,
        total: mockProducts.length,
        totalPages: 2,
      });
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: true,
          brand: true,
        },
        skip: 0,
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    test("should filter products by name, category, brand, and price range", async () => {
      prismaMock.product.findMany.mockResolvedValue([mockProducts[0]]);
      prismaMock.product.count.mockResolvedValue(1);

      const filters = {
        name: "Clavier",
        category: "ELECTRONICS",
        brand: "Logitech",
        minPrice: 100,
        maxPrice: 200,
      };

      const result = await productService.getAllProducts(filters);

      expect(result.products).toEqual([mockProducts[0]]);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: "Clavier", mode: "insensitive" },
          category: { name: { equals: "ELECTRONICS", mode: "insensitive" } },
          brand: { name: { contains: "Logitech", mode: "insensitive" } },
          price: { gte: 100, lte: 200 },
        },
        include: {
          category: true,
          brand: true,
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });

  // ---

  describe("getProductById", () => {
    test("should return a product by id", async () => {
      const mockProduct = { id: 1, name: "Product 1" };
      prismaMock.product.findUniqueOrThrow.mockResolvedValue(mockProduct);

      const product = await productService.getProductById(1);

      expect(product).toEqual(mockProduct);
      expect(prismaMock.product.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          category: true,
          brand: true,
        },
      });
    });

    test("should throw an error if product is not found", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          meta: { cause: "Record not found" },
          clientVersion: "2.28.0",
        }
      );
      prismaMock.product.findUniqueOrThrow.mockRejectedValue(prismaError);

      await expect(productService.getProductById(999)).rejects.toThrow(
        prismaError
      );
      expect(prismaMock.product.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          category: true,
          brand: true,
        },
      });
    });
  });

  // ---

  describe("createProduct", () => {
    test("should create a new product", async () => {
      const newProductData = {
        name: "Product 1",
        price: 300,
        stock_quantity: 30,
        sku: "P003",
        imageUrl: "/uploads/products/image6.jpg",
        category: { connect: { id: 1 } },
        brand: { connect: { id: 1 } },
      };
      const createdProduct = {
        id: 1,
        ...newProductData,
        description: null,
        weight: null,
      };
      prismaMock.product.create.mockResolvedValue(createdProduct);

      const product = await productService.createProduct(newProductData);

      expect(product).toEqual(createdProduct);
      expect(prismaMock.product.create).toHaveBeenCalledWith({
        data: newProductData,
        include: {
          category: true,
          brand: true,
        },
      });
    });
  });

  // ---

  describe("updateProduct", () => {
    test("should update an existing product", async () => {
      const updatedData = { name: "Updated Product" };
      const updatedProduct = { id: 1, name: "Updated Product" };
      prismaMock.product.update.mockResolvedValue(updatedProduct);

      const product = await productService.updateProduct(1, updatedData);

      expect(product).toEqual(updatedProduct);
      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
        include: {
          category: true,
          brand: true,
        },
      });
    });
  });

  // ---

  describe("deleteProduct", () => {
    test("should delete a product successfully", async () => {
      const deletedProduct = { id: 1, name: "Product to Delete" };
      prismaMock.product.delete.mockResolvedValue(deletedProduct);

      const product = await productService.deleteProduct(1);

      expect(product).toEqual(deletedProduct);
      expect(prismaMock.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should throw an error if product to delete is not found", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record to delete does not exist.",
        {
          code: "P2025",
          clientVersion: "2.28.0",
        }
      );
      prismaMock.product.delete.mockRejectedValue(prismaError);

      await expect(productService.deleteProduct(999)).rejects.toThrow(
        prismaError
      );
      expect(prismaMock.product.delete).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});
