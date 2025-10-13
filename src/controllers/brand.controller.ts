import { Request, Response } from "express";
import { Brand } from "../generated/prisma";
import * as brandService from "../services/brand.service";
import { handlePrismaError } from "../utils/handlePrismaError";

export const getAllBrands = async (
  req: Request,
  res: Response
): Promise<Brand[] | undefined> => {
  try {
    const brands = await brandService.getAllBrands();

    if (brands.length === 0) {
      res.status(404).json({ message: "No brands found" });
      return;
    }
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBrand = async (
  req: Request,
  res: Response
): Promise<Brand | undefined> => {
  try {
    const brandId = Number(req.params.id);

    if (brandId <= 0) {
      res.status(400).json({ message: "Brand ID must be a positive number" });
      return;
    }
    const brand = await brandService.getBrandById(brandId);

    res.status(200).json(brand);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createBrand = async (
  req: Request,
  res: Response
): Promise<Brand | void> => {
  try {
    const newCustomer = await brandService.createBrand(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    if (handlePrismaError(error, res)) {
      return;
    }

    console.error("Error creating brand:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.id);

    if (isNaN(brandId) || brandId <= 0) {
      res.status(400).json({ message: "Brand ID must be a positive number" });
      return;
    }

    const brand = await brandService.deleteBrand(brandId);

    if (!brand) {
      res.status(404).json({
        message: `Brand with ID ${brandId} not found`,
      });
      return;
    }

    res.status(200).json({
      message: `Brand with ID ${brandId} deleted successfully`,
      brand,
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBrand = async (
  req: Request,
  res: Response
): Promise<Brand | void> => {
  try {
    const brandId = Number(req.params.id);

    const updatedBrand = await brandService.updateBrand(brandId, req.body);

    res.status(200).json(updatedBrand);
  } catch (error) {
    if (handlePrismaError(error, res)) {
      return;
    }
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
