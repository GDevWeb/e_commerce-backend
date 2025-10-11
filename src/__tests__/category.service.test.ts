const prismaMock = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock("../generated/prisma", () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

import * as categoryService from "../services/category.service";

describe("Category Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCategories", () => {
    test("should return all categories", async () => {
      const mockCategories = [
        { id: 1, name: "Electronics" },
        { id: 2, name: "Books" },
      ];
      prismaMock.category.findMany.mockResolvedValue(mockCategories);

      const categories = await categoryService.getAllCategories();

      expect(categories).toEqual(mockCategories);
      expect(prismaMock.category.findMany).toHaveBeenCalledTimes(1);
    });

    test("should return an empty array if no categories are found", async () => {
      prismaMock.category.findMany.mockResolvedValue([]);

      const categories = await categoryService.getAllCategories();

      expect(categories).toEqual([]);
      expect(prismaMock.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCategory", () => {
    test("should return", async () => {
      const mockCategory = { id: 1, name: "Electronics" };
      prismaMock.category.findUnique.mockResolvedValue(mockCategory);

      const category = await categoryService.getCategoryById(1);

      expect(category).toEqual(mockCategory);
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should return null if category is not found", async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const category = await categoryService.getCategoryById(999);

      expect(category).toBeNull();
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe("createCategory", () => {
    test("should create a new category", async () => {
      const newCategoryData = { name: "Home Appliances" };
      const createdCategory = { id: 3, ...newCategoryData };
      prismaMock.category.create.mockResolvedValue(createdCategory);

      const category = await categoryService.createCategory(newCategoryData);

      expect(category).toEqual(createdCategory);
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: newCategoryData,
      });
    });
  });

  describe("deleteCategory", () => {
    test("should delete a category", async () => {
      const deletedCategory = { id: 1, name: "Electronics" };
      prismaMock.category.delete.mockResolvedValue(deletedCategory);

      const category = await categoryService.deleteCategory(1);

      expect(category).toEqual(deletedCategory);
      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe("updateCategory", () => {
    test("should update an existing category", async () => {
      const updatedCategoryData = { name: "Updated Books" };
      const updatedCategory = { id: 2, ...updatedCategoryData };
      prismaMock.category.update.mockResolvedValue(updatedCategory);

      const category = await categoryService.updateCategory(
        2,
        updatedCategoryData
      );

      expect(category).toEqual(updatedCategory);
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: updatedCategoryData,
      });
    });

    test("should return null if category to update is not found", async () => {
      prismaMock.category.update.mockResolvedValue(null);

      const category = await categoryService.updateCategory(999, {
        name: "NonExistent",
      });

      expect(category).toBeNull();
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 999 },
        data: { name: "NonExistent" },
      });
    });
  });
});
