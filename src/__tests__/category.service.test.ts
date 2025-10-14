const prismaMock = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
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
    test("should return all categories with products", async () => {
      const mockCategories = [
        {
          id: 1,
          name: "ELECTRONICS",
          products: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "BOOKS",
          products: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prismaMock.category.findMany.mockResolvedValue(mockCategories);

      const categories = await categoryService.getAllCategories();

      expect(categories).toEqual(mockCategories);
      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        include: {
          products: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    });

    test("should return an empty array if no categories are found", async () => {
      prismaMock.category.findMany.mockResolvedValue([]);

      const categories = await categoryService.getAllCategories();

      expect(categories).toEqual([]);
      expect(prismaMock.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCategoryById", () => {
    test("should return a category by ID", async () => {
      const mockCategory = {
        id: 1,
        name: "ELECTRONICS",
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.category.findUniqueOrThrow.mockResolvedValue(mockCategory);

      const category = await categoryService.getCategoryById(1);

      expect(category).toEqual(mockCategory);
      expect(prismaMock.category.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: true,
        },
      });
    });

    test("should throw error if category is not found", async () => {
      const mockError = new Error("Record not found");
      (mockError as any).code = "P2025";

      prismaMock.category.findUniqueOrThrow.mockRejectedValue(mockError);

      await expect(categoryService.getCategoryById(999)).rejects.toThrow(
        "Record not found"
      );

      expect(prismaMock.category.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          products: true,
        },
      });
    });
  });

  describe("createCategory", () => {
    test("should create a new category with uppercase name", async () => {
      const newCategoryData = { name: "home appliances" };
      const createdCategory = {
        id: 3,
        name: "HOME APPLIANCES",
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.create.mockResolvedValue(createdCategory);

      const category = await categoryService.createCategory(newCategoryData);

      expect(category).toEqual(createdCategory);
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          name: "HOME APPLIANCES",
        },
      });
    });

    test("should trim whitespace from category name", async () => {
      const newCategoryData = { name: "  gaming  " };
      const createdCategory = {
        id: 4,
        name: "GAMING",
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.create.mockResolvedValue(createdCategory);

      const category = await categoryService.createCategory(newCategoryData);

      expect(category.name).toBe("GAMING");
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: { name: "GAMING" },
      });
    });

    test("should throw P2002 error if category name already exists", async () => {
      const mockError = new Error("Unique constraint failed");
      (mockError as any).code = "P2002";
      (mockError as any).meta = { target: ["name"] };

      prismaMock.category.create.mockRejectedValue(mockError);

      await expect(
        categoryService.createCategory({ name: "ELECTRONICS" })
      ).rejects.toThrow("Unique constraint failed");
    });
  });

  describe("updateCategory", () => {
    test("should update an existing category with uppercase name", async () => {
      const updatedCategoryData = { name: "updated books" };
      const updatedCategory = {
        id: 2,
        name: "UPDATED BOOKS",
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.update.mockResolvedValue(updatedCategory);

      const category = await categoryService.updateCategory(
        2,
        updatedCategoryData
      );

      expect(category).toEqual(updatedCategory);
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { name: "UPDATED BOOKS" },
      });
    });

    test("should throw P2025 error if category to update is not found", async () => {
      const mockError = new Error("Record not found");
      (mockError as any).code = "P2025";

      prismaMock.category.update.mockRejectedValue(mockError);

      await expect(
        categoryService.updateCategory(999, { name: "NonExistent" })
      ).rejects.toThrow("Record not found");

      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 999 },
        data: { name: "NONEXISTENT" },
      });
    });

    test("should throw P2002 error if updated name already exists", async () => {
      const mockError = new Error("Unique constraint failed");
      (mockError as any).code = "P2002";
      (mockError as any).meta = { target: ["name"] };

      prismaMock.category.update.mockRejectedValue(mockError);

      await expect(
        categoryService.updateCategory(2, { name: "ELECTRONICS" })
      ).rejects.toThrow("Unique constraint failed");
    });
  });

  describe("deleteCategory", () => {
    test("should delete a category", async () => {
      const deletedCategory = {
        id: 1,
        name: "ELECTRONICS",
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.delete.mockResolvedValue(deletedCategory);

      const category = await categoryService.deleteCategory(1);

      expect(category).toEqual(deletedCategory);
      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should throw P2025 error if category to delete is not found", async () => {
      const mockError = new Error("Record not found");
      (mockError as any).code = "P2025";

      prismaMock.category.delete.mockRejectedValue(mockError);

      await expect(categoryService.deleteCategory(999)).rejects.toThrow(
        "Record not found"
      );
    });

    test("should throw P2003 error if category has related products", async () => {
      const mockError = new Error("Foreign key constraint failed");
      (mockError as any).code = "P2003";

      prismaMock.category.delete.mockRejectedValue(mockError);

      await expect(categoryService.deleteCategory(1)).rejects.toThrow(
        "Foreign key constraint failed"
      );
    });
  });
});
