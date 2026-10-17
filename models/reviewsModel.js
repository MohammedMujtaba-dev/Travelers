import mongoose from "mongoose";
import { Schema } from "mongoose";
const reviewSchema = new Schema(
  {
    comment: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    reviewOwner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.models.review || mongoose.model("review", reviewSchema);
export default Review;
