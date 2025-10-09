import { Request, Response } from "express";
import { Product } from "../generated/prisma";
import * as productService from "../services/product.service";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<Product[] | undefined> => {
  try {
    const products = await productService.getAllProducts();

    if (products.length === 0) {
      res.status(404).json({ message: "No products found" });
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<Product | undefined> => {
  try {
    const productId = Number(req.params.productId);

    if (isNaN(productId) || productId <= 0) {
      res.status(400).json({ message: "Product ID must be a positive number" });
      return;
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<Partial<Product> | void> => {
  try {
    const { name, category_id, price, stock_quantity } = req.body;

    if (!name || !category_id || !price || !stock_quantity) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (typeof name !== "string" || name.trim() === "") {
      res
        .status(400)
        .json({ message: "Product name must be a non-empty string" });
      return;
    }
    if (typeof category_id !== "number" || category_id <= 0) {
      res
        .status(400)
        .json({ message: "Category ID must be a positive number" });
      return;
    }
    if (typeof price !== "number" || price <= 0) {
      res.status(400).json({ message: "Price must be a positive number" });
      return;
    }
    if (typeof stock_quantity !== "number" || stock_quantity < 0) {
      res
        .status(400)
        .json({ message: "Stock quantity must be a non-negative number" });
      return;
    }

    const data = {
      name,
      category_id,
      price,
      stock_quantity,
    };

    const newProduct = await productService.createProduct({
      name: data.name,
      price: data.price,
      stock_quantity: data.stock_quantity,
      category: { connect: { id: data.category_id } },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    if (isNaN(productId) || productId <= 0) {
      res.status(400).json({ message: "Brand ID must be a positive number" });
      return;
    }

    const product = await productService.deleteProduct(productId);

    if (!product) {
      res.status(404).json({
        message: `Product with ID ${productId} not found`,
      });
      return;
    }

    res.status(200).json({
      message: `Product with ID ${productId} deleted successfully`,
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Product | void> => {
  try {
    const productId = Number(req.params.productId);

    if (isNaN(productId) || productId <= 0) {
      res.status(400).json({ message: "Product ID must be a positive number" });
      return;
    }

    const existingProduct = await productService.getProductById(productId);

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const { name, category_id, price, stock_quantity } = req.body;

    if (!name && !category_id && !price && !stock_quantity) {
      res.status(400).json({ message: "No update data provided" });
      return;
    }

    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim() === "")
    ) {
      res
        .status(400)
        .json({ message: "Product name must be a non-empty string" });
      return;
    }
    if (
      category_id !== undefined &&
      (typeof category_id !== "number" || category_id <= 0)
    ) {
      res
        .status(400)
        .json({ message: "Category ID must be a positive number" });
      return;
    }
    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      res.status(400).json({ message: "Price must be a positive number" });
      return;
    }
    if (
      stock_quantity !== undefined &&
      (typeof stock_quantity !== "number" || stock_quantity < 0)
    ) {
      res
        .status(400)
        .json({ message: "Stock quantity must be a non-negative number" });
      return;
    }

    const data = {
      name: name !== undefined ? name : existingProduct.name,
      category:
        category_id !== undefined
          ? { connect: { id: category_id } }
          : undefined,
      price: price !== undefined ? price : existingProduct.price,
      stock_quantity:
        stock_quantity !== undefined
          ? stock_quantity
          : existingProduct.stock_quantity,
    };

    const updatedProduct = await productService.updateProduct(productId, data);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
