import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";
import upload from "../middlewares/upload.middleware";

const productRouter = express.Router();

// get
productRouter.get("/", getAllProducts);

// getById
productRouter.get("/:productId", getProduct);

// post
productRouter.post("/", upload.single("imageUrl"), createProduct);

// delete
productRouter.delete("/:productId", deleteProduct);

// update
productRouter.put("/:productId", updateProduct);

export default productRouter;
