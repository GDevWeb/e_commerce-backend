import { Request, Response } from "express";
import { Brand } from "../generated/prisma";
import * as brandService from "../services/brand.service";

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
    const brandId = Number(req.params.brandId);

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
): Promise<Partial<Brand> | void> => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || name.trim() === "") {
      res
        .status(400)
        .json({ message: "Category name must be a non-empty string" });
      return;
    }

    const data = { name };

    const newCategory = await brandService.createBrand({
      name: data.name,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.brandId);

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

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.brandId);

    if (isNaN(brandId) || brandId <= 0) {
      res.status(400).json({ message: "Brand ID must be a positive number" });
      return;
    }

    const existingBrand = await brandService.getBrandById(brandId);

    if (!existingBrand) {
      res.status(404).json({ message: "Brand not found" });
      return;
    }

    const { name } = req.body;

    if (name === undefined) {
      res.status(400).json({ message: "No update data provided" });
      return;
    }

    if (typeof name !== "string" || name.trim() === "") {
      res
        .status(400)
        .json({ message: "Brand name must be a non-empty string" });
      return;
    }

    const data = {
      name: name !== undefined ? name : existingBrand.name,
    };

    const updatedBrand = await brandService.updateBrand(brandId, data);

    res.status(200).json(updatedBrand);
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
