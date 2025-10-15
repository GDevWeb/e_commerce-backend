import * as reviewService from "../services/review.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllReviews = asyncHandler(async (req, res) => {
  const filters = {
    productId: req.query.productId
      ? parseInt(req.query.productId as string)
      : undefined,
    customerId: req.query.customerId
      ? parseInt(req.query.customerId as string)
      : undefined,
    minRating: req.query.minRating
      ? parseInt(req.query.minRating as string)
      : undefined,
    maxRating: req.query.maxRating
      ? parseInt(req.query.maxRating as string)
      : undefined,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
  };

  const result = await reviewService.getAllReviews(filters);

  res.status(200).json({
    status: "success",
    results: result.reviews.length,
    data: result.reviews,
    pagination: result.pagination,
  });
});

export const getReview = asyncHandler(async (req, res) => {
  const reviewId = parseInt(req.params.id);
  const review = await reviewService.getReviewById(reviewId);

  res.status(200).json({
    status: "success",
    data: review,
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const newReview = await reviewService.createReview(req.body);

  res.status(201).json({
    status: "success",
    message: "Review created successfully",
    data: newReview,
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  const reviewId = parseInt(req.params.id);
  const updatedReview = await reviewService.updateReview(reviewId, req.body);

  res.status(200).json({
    status: "success",
    message: "Review updated successfully",
    data: updatedReview,
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = parseInt(req.params.id);
  const deletedReview = await reviewService.deleteReview(reviewId);

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
    data: deletedReview,
  });
});
