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

productRouter.get("/", getAllProducts);

productRouter.get("/:id", getProduct);

productRouter.post("/", upload.single("imageUrl"), createProduct);

productRouter.put("/:id", updateProduct);

productRouter.delete("/:id", deleteProduct);

export default productRouter;
