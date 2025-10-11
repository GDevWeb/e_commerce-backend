const prismaMock = {
  brand: {
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

import * as brandService from "../services/brand.service";

describe("getAllBrands", () => {
  test("should return all brands", async () => {
    const mockBrands = [
      { id: 1, name: "Corsair" },
      { id: 2, name: "Asus" },
    ];
    prismaMock.brand.findMany.mockResolvedValue(mockBrands);
  });
});

describe("getBrand", () => {
  test("should return", async () => {
    const mockBrand = { id: 2, name: "Asus" };
    prismaMock.brand.findUnique.mockResolvedValue(mockBrand);

    const brand = await brandService.getBrandById(2);

    expect(brand).toEqual(mockBrand);
    expect(prismaMock.brand.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
    });
  });

  test("should return null if brand is not found", async () => {
    prismaMock.brand.findUnique.mockResolvedValue(null);

    const brand = await brandService.getBrandById(999);
    expect(brand).toBeNull();
    expect(prismaMock.brand.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});

describe("createBrand", () => {
  test("should create a new brand", async () => {
    const newBrand = { name: "Asrog" };
    const createdBrand = { id: 3, ...newBrand };
    prismaMock.brand.create.mockResolvedValue(createdBrand);

    const brand = await brandService.createBrand(newBrand);

    expect(brand).toEqual(createdBrand);
    expect(prismaMock.brand.create).toHaveBeenLastCalledWith({
      data: newBrand,
    });
  });
});

describe("deleteBrand", () => {
  test("should delete a brand", async () => {
    const deletedBrand = { id: 1, name: "Corsair" };
    prismaMock.brand.delete.mockResolvedValue(deletedBrand);

    const brand = await brandService.deleteBrand(1);

    expect(brand).toEqual(deletedBrand);
    expect(prismaMock.brand.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  test("should return null if brand to delete is not found", async () => {
    prismaMock.brand.delete.mockResolvedValue(null);

    const brand = await brandService.deleteBrand(999);

    expect(brand).toBeNull();
    expect(prismaMock.brand.delete).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});

describe("updateBrand", () => {
  test("should update an existing brand", async () => {
    const updatedBrandData = { name: "Updated Corsair" };
    const updatedBrand = { id: 1, ...updatedBrandData };
    prismaMock.brand.update.mockResolvedValue(updatedBrand);

    const brand = await brandService.updateBrand(1, updatedBrandData);

    expect(brand).toEqual(updatedBrand);
    expect(prismaMock.brand.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updatedBrandData,
    });
  });

  test("should return null if brand to update is not found", async () => {
    prismaMock.brand.update.mockResolvedValue(null);

    const brand = await brandService.updateBrand(999, {
      name: "NonExistent",
    });

    expect(brand).toBeNull();
    expect(prismaMock.brand.update).toHaveBeenCalledWith({
      where: { id: 999 },
      data: { name: "NonExistent" },
    });
  });
});
