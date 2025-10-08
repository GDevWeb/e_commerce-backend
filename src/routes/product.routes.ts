import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";

const productRouter = express.Router();

// get
productRouter.get("/", getAllProducts);

// getById
productRouter.get("/:productId", getProduct);

// post
productRouter.post("/", createProduct);

// delete
productRouter.delete("/:productId", deleteProduct);

// update
productRouter.put("/:productId", updateProduct);

export default productRouter;
