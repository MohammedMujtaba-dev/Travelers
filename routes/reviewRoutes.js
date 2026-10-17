import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Review from "../models/reviewsModel.js";

import Listing from "../models/listingModel.js";
import {
  isReviewOwner,
  loggedIn,
  validatereviews,
} from "../utils/Middleware.js";
import { reviewDelete, reviewPost } from "../controllers/reviewControllers.js";

const reviewRouter = express.Router({ mergeParams: true });

//  REQ POST REVIEWS CREATE

reviewRouter.post("/", loggedIn, validatereviews, wrapAsync(reviewPost));

// REQ DELETE FOR REVIEWS

reviewRouter.delete(
  "/:reviewId",
  loggedIn,
  isReviewOwner,
  wrapAsync(reviewDelete),
);

export default reviewRouter;
