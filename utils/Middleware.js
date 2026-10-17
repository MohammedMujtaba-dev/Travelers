import Listing from "../models/listingModel.js";
import { listingSchema, reviewSchema } from "./SchemaValidator.js";
import Review from "../models/reviewsModel.js";
import ExpressError from "../utils/ExpressError.js";

const loggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.session.originalMethod = req.originalMethod;
    req.flash("error", "Please login !");
    return res.redirect("/auth/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    res.locals.originalMethod = req.session.originalMethod;
  }
  next();
};

const isOwner = async (req, res, next) => {
  const id = req.params.id;
  const findListing = await Listing.findById(id);

  if (!(req.user && findListing.owner._id.equals(req.user._id))) {
    req.flash("error", "Access denied !");
    return res.redirect(`/listings/individual/${id}`);
  }
  next();
};

//  VALIDATION - LISTINGSCHEMA FROM JOI
const validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//  VALIDATION - REVIEWSCHEMA FROM JOI

const validatereviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error || req.body.comment == "null" || req.body.comment == "undefined") {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

const isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId).populate("reviewOwner");
  if (!(req.user && review.reviewOwner._id.equals(req.user._id))) {
    req.flash("error", "Access denied !");
    return res.redirect(`/listings/individual/${id}`);
  }
  next();
};

export {
  loggedIn,
  saveRedirectUrl,
  isOwner,
  validatelisting,
  validatereviews,
  isReviewOwner,
};
