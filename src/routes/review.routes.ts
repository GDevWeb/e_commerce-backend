import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
} from "../controllers/review.controller";
import { validate } from "../middlewares/validate";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../schemas/review.schema";

const reviewRouter = express.Router();

reviewRouter.get("/", getAllReviews);

reviewRouter.get("/:id", getReview);

reviewRouter.post("/", validate(createReviewSchema), createReview);

reviewRouter.patch("/:id", validate(updateReviewSchema), updateReview);

reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;
