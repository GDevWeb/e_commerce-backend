import { Request, Response } from "express";
import * as brandService from "../services/brand.service";
import { handlePrismaError } from "../utils/handlePrismaError";

export const getAllBrands = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const brands = await brandService.getAllBrands();

    res.status(200).json({
      status: "success",
      results: brands.length,
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brandId = parseInt(req.params.id);

    const brand = await brandService.getBrandById(brandId);

    res.status(200).json({
      status: "success",
      data: brand,
    });
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }
    console.error("Error fetching brand:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const createBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newBrand = await brandService.createBrand(req.body);

    res.status(201).json({
      status: "success",
      message: "Brand created successfully",
      data: newBrand,
    });
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }
    console.error("Error creating brand:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const brandId = parseInt(req.params.id);

    const updatedBrand = await brandService.updateBrand(brandId, req.body);

    res.status(200).json({
      status: "success",
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }
    console.error("Error updating brand:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const brandId = parseInt(req.params.id);

    const deletedBrand = await brandService.deleteBrand(brandId);

    res.status(200).json({
      status: "success",
      message: "Brand deleted successfully",
      data: deletedBrand,
    });
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }
    console.error("Error deleting brand:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
