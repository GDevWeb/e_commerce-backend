const prismaMock = {
  review: {
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

jest.mock("../generated/prisma", () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: { cause: string };
      constructor(
        message: string,
        { code, meta }: { code: string; meta?: { cause: string } }
      ) {
        super(message);
        this.code = code;
        this.meta = meta;
        this.name = "PrismaClientKnownRequestError";
      }
    },
  },
}));

import * as reviewService from "../services/review.service";

describe("Review Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const reviewItem = {
    id: 1,
    product_id: 1,
    customer_id: 1,
    rating: 5,
    comment: "Great product!",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("getAllReviews", () => {
    it("should return all reviews", async () => {
      const mockReviews = [reviewItem];
      prismaMock.review.findMany.mockResolvedValue(mockReviews);
      prismaMock.review.count.mockResolvedValue(mockReviews.length);

      const result = await reviewService.getAllReviews({});

      expect(result.reviews).toEqual(mockReviews);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: mockReviews.length,
        totalPages: 1,
      });
    });
  });

  describe("getReview", () => {
    it("should return a single review by its ID", async () => {
      prismaMock.review.findUniqueOrThrow.mockResolvedValue(reviewItem);

      const result = await reviewService.getReviewById(1);

      expect(result).toEqual(reviewItem);
      expect(prismaMock.review.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw an error if the review is not found", async () => {
      const error = new Error("Review not found");
      prismaMock.review.findUniqueOrThrow.mockRejectedValue(error);

      await expect(reviewService.getReviewById(999)).rejects.toThrow(error);
    });
  });
  describe("createReview", () => {
    it("should create and return a new review", async () => {
      const newReviewData = {
        product_id: 1,
        customer_id: 1,
        rating: 4,
        comment: "Good product!", // Removed createdAt as it's auto-generated
      };
      const createdReview: any = {
        product: { id: newReviewData.product_id },
        customer: { id: newReviewData.customer_id },

        ...reviewItem,
        ...newReviewData,
        id: 2,
      };
      prismaMock.review.create.mockResolvedValue(createdReview);

      const result = await reviewService.createReview({
        ...newReviewData,
        product: { connect: { id: newReviewData.product_id } },
        customer: { connect: { id: newReviewData.customer_id } },
      });
      const expectedData = {
        ...newReviewData,
        product: { connect: { id: newReviewData.product_id } },
        customer: { connect: { id: newReviewData.customer_id } },
      };
      expect(result).toEqual(createdReview);
      expect(prismaMock.review.create).toHaveBeenCalledWith({
        data: expectedData,
      });
    });
  });
  describe("updateReview", () => {
    it("should update and return the review", async () => {
      const updateData = { rating: 4, comment: "Updated comment" };
      const updatedReview = { ...reviewItem, ...updateData };
      prismaMock.review.update.mockResolvedValue(updatedReview);

      const result = await reviewService.updateReview(1, updateData);

      expect(result).toEqual(updatedReview);
      expect(prismaMock.review.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it("should throw an error if the review to update is not found", async () => {
      const error = new Error("Review not found");
      prismaMock.review.update.mockRejectedValue(error);

      await expect(
        reviewService.updateReview(999, { rating: 3 })
      ).rejects.toThrow(error);
    });
  });
  describe("deleteReview", () => {
    it("should delete and return the review", async () => {
      prismaMock.review.delete.mockResolvedValue(reviewItem);

      const result = await reviewService.deleteReview(1);

      expect(result).toEqual(reviewItem);
      expect(prismaMock.review.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw an error if the review to delete is not found", async () => {
      const error = new Error("Review not found");
      prismaMock.review.delete.mockRejectedValue(error);

      await expect(reviewService.deleteReview(999)).rejects.toThrow(error);
    });
  });
});
