import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";
import { validate } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);

categoryRouter.get("/:id", getCategory);

categoryRouter.post("/", validate(createCategorySchema), createCategory);

categoryRouter.delete("/:id", deleteCategory);

categoryRouter.put("/:id", validate(updateCategorySchema), updateCategory);

export default categoryRouter;
