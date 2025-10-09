import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";
import { Product } from "../generated/prisma";
import * as productService from "../services/product.service";
// Mock the product service
jest.mock("../services/product.service");

const mockProductService = productService as jest.Mocked<typeof productService>;

describe("Product Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {
      params: {},
      body: {},
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test suite for getAllProducts
  describe("getAllProducts", () => {
    it("should return all products with status 200", async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Laptop",
          price: 1200,
          stock_quantity: 50,
          category_id: 1,
        },
        {
          id: 2,
          name: "Mouse",
          price: 25,
          stock_quantity: 200,
          category_id: 1,
        },
      ];
      mockProductService.getAllProducts.mockResolvedValue(mockProducts);

      await getAllProducts(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockProducts);
    });

    it("should return 404 if no products are found", async () => {
      mockProductService.getAllProducts.mockResolvedValue([]);

      await getAllProducts(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "No products found" });
    });

    it("should return 500 on server error", async () => {
      mockProductService.getAllProducts.mockRejectedValue(
        new Error("DB Error")
      );

      await getAllProducts(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  // Test suite for getProduct
  describe("getProduct", () => {
    it("should return a product with status 200 if found", async () => {
      const mockProduct: Product = {
        id: 1,
        name: "Laptop",
        price: 1200,
        stock_quantity: 50,
        category_id: 1,
      };
      req.params = { productId: "1" };
      mockProductService.getProductById.mockResolvedValue(mockProduct);

      await getProduct(req as Request, res as Response);

      expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockProduct);
    });

    it("should return 404 if product not found", async () => {
      req.params = { productId: "99" };
      mockProductService.getProductById.mockResolvedValue(null);

      await getProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should return 400 for an invalid product ID", async () => {
      req.params = { productId: "abc" };

      await getProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Product ID must be a positive number",
      });
    });
  });

  // Test suite for createProduct
  describe("createProduct", () => {
    it("should create a product and return it with status 201", async () => {
      const newProductData = {
        name: "Keyboard",
        price: 75,
        stock_quantity: 150,
        category_id: 1,
      };
      const createdProduct: Product = { id: 3, ...newProductData };
      req.body = newProductData;

      // The service expects a different structure for category
      const servicePayload = {
        name: newProductData.name,
        price: newProductData.price,
        stock_quantity: newProductData.stock_quantity,
        category: { connect: { id: newProductData.category_id } },
      };

      mockProductService.createProduct.mockResolvedValue(createdProduct);

      await createProduct(req as Request, res as Response);

      expect(mockProductService.createProduct).toHaveBeenCalledWith(
        servicePayload
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdProduct);
    });

    it("should return 400 if required fields are missing", async () => {
      req.body = { name: "Incomplete Product" };

      await createProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should return 400 for invalid data", async () => {
      req.body = { name: "", price: -10, stock_quantity: 10, category_id: 1 };

      await createProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Product name must be a non-empty string",
      });
    });
  });

  // Test suite for updateProduct
  describe("updateProduct", () => {
    it("should update a product and return it with status 200", async () => {
      const productId = 1;
      const existingProduct: Product = {
        id: productId,
        name: "Old Name",
        price: 100,
        stock_quantity: 10,
        category_id: 1,
      };
      const updateData = { name: "New Name", price: 120 };
      const updatedProduct: Product = { ...existingProduct, ...updateData };

      req.params = { productId: String(productId) };
      req.body = updateData;

      mockProductService.getProductById.mockResolvedValue(existingProduct);
      mockProductService.updateProduct.mockResolvedValue(updatedProduct);

      await updateProduct(req as Request, res as Response);

      const expectedServicePayload = {
        name: "New Name",
        price: 120,
        category: undefined,
        stock_quantity: 10,
      };

      expect(mockProductService.getProductById).toHaveBeenCalledWith(productId);
      expect(mockProductService.updateProduct).toHaveBeenCalledWith(
        productId,
        expect.objectContaining(expectedServicePayload)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedProduct);
    });

    it("should return 404 if product to update is not found", async () => {
      req.params = { productId: "99" };
      req.body = { name: "New Name" };
      mockProductService.getProductById.mockResolvedValue(null);

      await updateProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should return 400 if no update data is provided", async () => {
      const productId = 1;
      const existingProduct: Product = {
        id: productId,
        name: "Old Name",
        price: 100,
        stock_quantity: 10,
        category_id: 1,
      };
      req.params = { productId: String(productId) };
      req.body = {}; // No data
      mockProductService.getProductById.mockResolvedValue(existingProduct);

      await updateProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "No update data provided",
      });
    });

    it("should return 400 for invalid update data", async () => {
      const productId = 1;
      const existingProduct: Product = {
        id: productId,
        name: "Old Name",
        price: 100,
        stock_quantity: 10,
        category_id: 1,
      };
      req.params = { productId: String(productId) };
      req.body = { price: -50 }; // Invalid price
      mockProductService.getProductById.mockResolvedValue(existingProduct);

      await updateProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Price must be a positive number",
      });
    });
  });

  // Test suite for deleteProduct
  describe("deleteProduct", () => {
    it("should delete a product and return a success message with status 200", async () => {
      const productId = 1;
      const deletedProduct: Product = {
        id: productId,
        name: "Deleted Product",
        price: 100,
        stock_quantity: 10,
        category_id: 1,
      };
      req.params = { productId: String(productId) };

      mockProductService.deleteProduct.mockResolvedValue(deletedProduct);

      await deleteProduct(req as Request, res as Response);

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: `Product with ID ${productId} deleted successfully`,
        deletedProduct,
      });
    });

    it("should return 400 for an invalid product ID", async () => {
      req.params = { productId: "invalid" };

      await deleteProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Product ID must be a positive number",
      });
    });

    it("should return 500 if the service throws an error (e.g., product not found)", async () => {
      const productId = 99;
      req.params = { productId: String(productId) };
      mockProductService.deleteProduct.mockRejectedValue(
        new Error("Prisma error P2025")
      );

      await deleteProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
