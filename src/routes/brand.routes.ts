import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from "../controllers/brand.controller";

const brandRouter = express.Router();

brandRouter.get("/", getAllBrands);

brandRouter.get("/:brandId", getBrand);

brandRouter.post("/", createBrand);

brandRouter.delete("/:brandId", deleteBrand);

brandRouter.put("/:brandId", updateBrand);

export default brandRouter;
