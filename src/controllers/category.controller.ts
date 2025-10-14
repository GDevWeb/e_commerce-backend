import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { handlePrismaError } from "../utils/handlePrismaError";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);

    const category = await categoryService.getCategoryById(categoryId);

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }
    console.error("Error fetching category:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newCategory = await categoryService.createCategory(req.body);

    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }
    console.error("Error creating category:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);

    const updatedCategory = await categoryService.updateCategory(
      categoryId,
      req.body
    );

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }
    console.error("Error updating category:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);

    const deletedCategory = await categoryService.deleteCategory(categoryId);

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }
    console.error("Error deleting category:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
