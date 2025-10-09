import { Request, Response } from "express";
import { Category } from "../generated/prisma";
import * as categoryService from "../services/category.service";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<Category[] | undefined> => {
  try {
    const categories = await categoryService.getAllCategories();

    if (categories.length === 0) {
      res.status(404).json({ message: "No categories found" });
      return;
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategory = async (
  req: Request,
  res: Response
): Promise<Category | undefined> => {
  try {
    const categoryId = Number(req.params.categoryId);

    if (isNaN(categoryId) || categoryId <= 0) {
      res
        .status(400)
        .json({ message: "Category ID must be a positive number" });
      return;
    }

    const category = await categoryService.getCategoryById(categoryId);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<Partial<Category> | void> => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || name.trim() === "") {
      res
        .status(400)
        .json({ message: "Category name must be a non-empty string" });
      return;
    }

    const data = { name };

    const newCategory = await categoryService.createCategory({
      name: data.name,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = Number(req.params.categoryId);

    if (isNaN(categoryId) || categoryId <= 0) {
      res
        .status(400)
        .json({ message: "Category ID must be a positive number" });
      return;
    }
    const category = await categoryService.deleteCategory(categoryId);

    if (!category) {
      res.status(404).json({
        message: `Category with ID ${categoryId} not found`,
      });
      return;
    }

    res.status(200).json({
      message: `Category with ID ${categoryId} deleted successfully`,
      category,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<Category | void> => {
  try {
    const categoryId = Number(req.params.categoryId);

    if (isNaN(categoryId) || categoryId <= 0) {
      res
        .status(400)
        .json({ message: "Category ID must be a positive number" });
      return;
    }

    const existingCategory = await categoryService.getCategoryById(categoryId);

    if (!existingCategory) {
      res.status(404).json({ message: "Category not found" });
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
        .json({ message: "Category name must be a non-empty string" });
      return;
    }

    const data = {
      name: name !== undefined ? name : existingCategory.name,
    };

    const updatedCategory = await categoryService.updateCategory(
      categoryId,
      data
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
