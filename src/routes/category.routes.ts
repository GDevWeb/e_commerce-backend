import express from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

categoryRouter.get("/:categoryId", async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const categories = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

categoryRouter.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const newCategory = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

categoryRouter.delete("/:categoryId", async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);
    if (isNaN(categoryId) || categoryId <= 0) {
      return res
        .status(400)
        .json({ message: "Category ID must be a positive number" });
    }

    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    res.status(200).json({
      message: `Category with ID ${categoryId} deleted successfully`,
      deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

categoryRouter.put("/:categoryId", async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);
    if (isNaN(categoryId) || categoryId <= 0) {
      return res
        .status(400)
        .json({ message: "Category ID must be a positive number" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default categoryRouter;
