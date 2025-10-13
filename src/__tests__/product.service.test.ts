const prismaMock = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock("../generated/prisma", () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string;
      constructor(message: string, code: string) {
        super(message);
        this.code = code;
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

  describe("getAllProducts", () => {
    test("Should return all products", async () => {
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
          name: "souris gamer",
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
      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const products = await productService.getAllProducts(1, 10, {});

      expect(products).toEqual(mockProducts);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: true,
          brand: true,
        },
        skip: 0,
        take: 10,
      });
    });

    test("should return an empty array if no products are found", async () => {
      prismaMock.product.findMany.mockResolvedValue([]);

      const products = await productService.getAllProducts(1, 10, {});

      expect(products).toEqual([]);
      expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
    });

    test("should handle pagination correctly", async () => {
      const mockProductsPage2 = [
        {
          id: 3,
          name: "Product 3",
          description: "Description 3",
          price: 300,
          stock_quantity: 30,
          category_id: 1,
          brand_id: 1,
          sku: "P003",
          imageUrl: "/uploads/products/image3.jpg",
          weight: 1.0,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 1, name: "ELECTRONICS" },
          brand: { id: 1, name: "Brand 1" },
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProductsPage2);

      const products = await productService.getAllProducts(2, 1, {});

      expect(products).toEqual(mockProductsPage2);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: true,
          brand: true,
        },
        skip: 1,
        take: 1,
      });
    });

    test("should filter products by name, category (exact match), and brand", async () => {
      const mockFilteredProducts = [
        {
          id: 1,
          name: "Laptop Dell",
          description: "Gaming laptop",
          price: 1500,
          stock_quantity: 5,
          category_id: 1,
          brand_id: 1,
          sku: "L001",
          imageUrl: "/uploads/products/image4.jpg",
          weight: 2.5,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 1, name: "ELECTRONICS" },
          brand: { id: 1, name: "Dell" },
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockFilteredProducts);

      const products = await productService.getAllProducts(1, 10, {
        name: "Laptop",
        category: "ELECTRONICS", // Changé pour correspondre à CategoryType
        brand: "Dell",
      });

      expect(products).toEqual(mockFilteredProducts);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: "Laptop", mode: "insensitive" },
          category: { name: "ELECTRONICS" }, // Changé: exact match au lieu de contains
          brand: { name: { contains: "Dell", mode: "insensitive" } },
        },
        include: {
          category: true,
          brand: true,
        },
        skip: 0,
        take: 10,
      });
    });

    test("should filter products only by name when provided", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Gaming Laptop",
          description: "High-end gaming laptop",
          price: 1500,
          stock_quantity: 5,
          category_id: 1,
          brand_id: 1,
          sku: "L001",
          imageUrl: "/uploads/products/laptop.jpg",
          weight: 2.5,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 1, name: "ELECTRONICS" },
          brand: { id: 1, name: "Dell" },
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const products = await productService.getAllProducts(1, 10, {
        name: "Laptop",
      });

      expect(products).toEqual(mockProducts);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: "Laptop", mode: "insensitive" },
        },
        include: {
          category: true,
          brand: true,
        },
        skip: 0,
        take: 10,
      });
    });

    test("should filter products only by brand when provided", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Gaming Mouse",
          description: "RGB gaming mouse",
          price: 79.99,
          stock_quantity: 10,
          category_id: 1,
          brand_id: 2,
          sku: "M001",
          imageUrl: "/uploads/products/mouse.jpg",
          weight: 0.2,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 1, name: "ELECTRONICS" },
          brand: { id: 2, name: "Logitech" },
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const products = await productService.getAllProducts(1, 10, {
        brand: "Logitech",
      });

      expect(products).toEqual(mockProducts);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          brand: { name: { contains: "Logitech", mode: "insensitive" } },
        },
        include: {
          category: true,
          brand: true,
        },
        skip: 0,
        take: 10,
      });
    });

    test("should filter products only by category when provided", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "T-Shirt",
          description: "Cotton t-shirt",
          price: 29.99,
          stock_quantity: 100,
          category_id: 2,
          brand_id: 3,
          sku: "TS001",
          imageUrl: "/uploads/products/tshirt.jpg",
          weight: 0.3,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 2, name: "CLOTHING" },
          brand: { id: 3, name: "Nike" },
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const products = await productService.getAllProducts(1, 10, {
        category: "CLOTHING",
      });

      expect(products).toEqual(mockProducts);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          category: { name: "CLOTHING" },
        },
        include: {
          category: true,
          brand: true,
        },
        skip: 0,
        take: 10,
      });
    });
  });

  describe("getProductById", () => {
    test("should return a product by id", async () => {
      const mockProduct = {
        id: 1,
        name: "Product 1",
        description: "Description 1",
        price: 300,
        stock_quantity: 30,
        category_id: 1,
        brand_id: 1,
        sku: "P003",
        imageUrl: "/uploads/products/image5.jpg",
        weight: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.findUnique.mockResolvedValue(mockProduct);

      const product = await productService.getProductById(1);

      expect(product).toEqual(mockProduct);
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should return null if product is not found", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      const product = await productService.getProductById(999);

      expect(product).toBeNull();
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe("createProduct", () => {
    test("should create a new product", async () => {
      const newProductData = {
        name: "Product 1",
        price: 300,
        stock_quantity: 30,
        sku: "P003",
        category: { connect: { id: 1 } },
        brand: { connect: { id: 1 } },
        imageUrl: "/uploads/products/image6.jpg",
      };
      const createdProduct = {
        id: 1,
        name: "Product 1",
        price: 300,
        stock_quantity: 30,
        sku: "P003",
        imageUrl: "/uploads/products/image6.jpg",
        description: null,
        weight: null,
        category_id: 1,
        brand_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.product.create.mockResolvedValue(createdProduct);

      const product = await productService.createProduct(newProductData);

      expect(product).toEqual(createdProduct);
      expect(prismaMock.product.create).toHaveBeenCalledWith({
        data: newProductData,
      });
    });
  });

  describe("deleteProduct", () => {
    test("should delete a product", async () => {
      const deletedProduct = {
        id: 1,
        name: "Product 1",
        price: 100,
        stock_quantity: 10,
        sku: "P001",
        imageUrl: "/uploads/products/image1.jpg",
        description: null,
        weight: null,
        category_id: 1,
        brand_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.product.delete.mockResolvedValue(deletedProduct);

      const product = await productService.deleteProduct(1);

      expect(product).toEqual(deletedProduct);
      expect(prismaMock.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should return null if product to delete is not found", async () => {
      const error: any = new Error("Record to delete does not exist.");
      error.name = "PrismaClientKnownRequestError";
      error.code = "P2025";
      error.clientVersion = "6.16.3";
      error.meta = { cause: "Record not found" };

      // Faire en sorte que instanceof fonctionne
      Object.setPrototypeOf(
        error,
        Prisma.PrismaClientKnownRequestError.prototype
      );

      prismaMock.product.delete.mockRejectedValue(error);

      const product = await productService.deleteProduct(999);

      expect(product).toBeNull();
      expect(prismaMock.product.delete).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    test("should throw error if deletion fails for other reasons", async () => {
      const error = new Error("Database connection error");
      prismaMock.product.delete.mockRejectedValue(error);

      await expect(productService.deleteProduct(1)).rejects.toThrow(
        "Database connection error"
      );
    });
  });

  describe("updateProduct", () => {
    test("should update an existing product", async () => {
      const updatedProductData = { name: "Updated Product" };
      const updatedProduct = {
        id: 2,
        name: "Updated Product",
        price: 200,
        stock_quantity: 20,
        sku: "P002",
        imageUrl: "/uploads/products/image2.jpg",
        description: null,
        weight: null,
        category_id: 1,
        brand_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.product.update.mockResolvedValue(updatedProduct);

      const product = await productService.updateProduct(2, updatedProductData);

      expect(product).toEqual(updatedProduct);
      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: updatedProductData,
      });
    });

    test("should handle update with multiple fields", async () => {
      const updatedProductData = {
        name: "Updated Product",
        price: 350,
        stock_quantity: 15,
        description: "New description",
      };
      const updatedProduct = {
        id: 2,
        name: "Updated Product",
        price: 350,
        stock_quantity: 15,
        description: "New description",
        sku: "P002",
        imageUrl: "/uploads/products/image2.jpg",
        weight: null,
        category_id: 1,
        brand_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.product.update.mockResolvedValue(updatedProduct);

      const product = await productService.updateProduct(2, updatedProductData);

      expect(product).toEqual(updatedProduct);
      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: updatedProductData,
      });
    });
  });
});
