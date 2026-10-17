import Listing from "../models/listingModel.js";
import Review from "../models/reviewsModel.js";
const reviewPost = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const listing = await Listing.findById(id);
  const { comment, rating } = req.body;

  const review = new Review({
    comment: comment,
    rating: rating,
  });
  review.reviewOwner = req.user._id;
  await review.save();
  listing.reviews.push(review);
  await listing.save();
  // console.log(review);
  // console.log(listing);
  req.flash("success", "Review added !");
  res.redirect(`/listings/individual/${id}`);
};
const reviewDelete = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("info", "Review deleted !");
  res.redirect(`/listings/individual/${id}`);
};
export { reviewPost, reviewDelete };
