import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);

categoryRouter.get("/:categoryId", getCategory);

categoryRouter.post("/", createCategory);

categoryRouter.delete("/:categoryId", deleteCategory);

categoryRouter.put("/:categoryId", updateCategory);

export default categoryRouter;
