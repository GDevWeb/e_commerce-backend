import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from "../controllers/brand.controller";
import { validate } from "../middlewares/validate";
import { createBrandSchema, updateBrandSchema } from "../schemas/brand.schema";

const brandRouter = express.Router();

brandRouter.get("/", getAllBrands);

brandRouter.get("/:id", getBrand);

brandRouter.post("/", validate(createBrandSchema), createBrand);

brandRouter.delete("/:id", deleteBrand);

brandRouter.patch("/:id", validate(updateBrandSchema), updateBrand);

export default brandRouter;
