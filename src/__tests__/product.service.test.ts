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
}));

import * as productService from "../services/product.service";

describe("Products Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    test("Should return all products", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Product 1",
          description: "Description 1",
          price: 100,
          stock_quantity: 10,
          category_id: 1,
          brand_id: 1,
          sku: "P001",
          category: { id: 1, name: "Category 1" },
          brand: { id: 1, name: "Brand 1" },
        },
        {
          id: 2,
          name: "Product 2",
          description: "Description 2",
          price: 200,
          stock_quantity: 20,
          category_id: 2,
          brand_id: 2,
          sku: "P002",
          category: { id: 2, name: "Category 2" },
          brand: { id: 2, name: "Brand 2" },
        },
      ];
      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const products = await productService.getAllProducts(1, 10);

      expect(products).toEqual(mockProducts);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
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

      const products = await productService.getAllProducts(1, 10);

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
          category: { id: 1, name: "Category 1" },
          brand: { id: 1, name: "Brand 1" },
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProductsPage2);

      const products = await productService.getAllProducts(2, 1);

      expect(products).toEqual(mockProductsPage2);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        include: {
          category: true,
          brand: true,
        },
        skip: 1,
        take: 1,
      });
    });
  });

  describe("getProduct", () => {
    test("should return", async () => {
      const mockProduct = {
        id: 1,
        name: "Product 1",
        description: "Description 1",
        price: 300,
        stock_quantity: 30,
        category_id: 1,
        brand_id: 1,
        sku: "P003",
        category: { id: 1, name: "Category 1" },
        brand: { id: 1, name: "Brand 1" },
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
      };
      const createdProduct = {
        id: 1,
        ...newProductData,
        category_id: 1,
        brand_id: 1,
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
      const deletedProduct = { id: 1 };
      prismaMock.product.delete.mockResolvedValue(deletedProduct);

      const product = await productService.deleteProduct(1);

      expect(product).toEqual(deletedProduct);
      expect(prismaMock.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe("updateProduct", () => {
    test("should update an existing product", async () => {
      const updatedProductData = { name: "Updated Books" };
      const updatedProduct = { id: 2, ...updatedProductData };
      prismaMock.product.update.mockResolvedValue(updatedProduct);

      const product = await productService.updateProduct(2, updatedProductData);

      expect(product).toEqual(updatedProduct);
      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: updatedProductData,
      });
    });

    test("should return null if product to update is not found", async () => {
      prismaMock.product.update.mockResolvedValue(null);

      const product = await productService.updateProduct(999, {
        name: "NonExistent",
      });

      expect(product).toBeNull();
      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { id: 999 },
        data: { name: "NonExistent" },
      });
    });
  });
});
