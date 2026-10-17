import Listing from "../models/listingModel.js";
import ExpressError from "../utils/ExpressError.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const AllListings = async (req, res, next) => {
  try {
    const listing = await Listing.find({});
    res.render("listing/index.ejs", { data: listing });
  } catch (err) {
    // next(err);
    throw new ExpressError(500);
  }
};

const SingleListing = async (req, res, next) => {
  const id = req.params.id;
  const Alllisting = await Listing.find({});
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "reviewOwner",
      },
    })
    .populate("owner");

  // const reviewsId = listing.reviews.map((o) => o._id);
  // const reviewsOwn = await Review.find().populate("owner");
  console.log(listing);
  if (!listing) {
    next(new ExpressError(403, "Listing not found !"));
  }
  res.render("listing/singlelisting.ejs", {
    data: listing,
    Alllisting: Alllisting,
  });
};

const CreateListing = (req, res) => {
  res.render("listing/newlisting.ejs");
};

const PostNewListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  // console.log(response);
  // console.log(response.body.features[0].geometry);
  // res.send(response.body.features);
  const { title, description, price, location, country, category } = req.body;
  const images = req.files.map((f) => f.path);

  const newListing = new Listing({
    title: title,
    description: description,
    price: price,
    location: location,
    image: images.length ? images : undefined,
    country: country,
    category: category,
  });
  newListing.owner = req.user._id;
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();

  console.log("New listing : ", newListing);
  req.flash("success", "New listing created !");
  res.redirect("/listings");
};

const UpdateListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(403, "Listing not found !");
  }

  res.render("listing/editlisting.ejs", { data: listing });
};

const PutListing = async (req, res) => {
  const id = req.params.id;
  const { title, description, price, location, country, category } = req.body;
  const newImages = req.files.map((f) => f.path);
  const prevImages = [].concat(req.body.image || []);
  const allImages = [...prevImages, ...newImages];
  const updateListing = {
    title: title,
    description: description,
    price: price,
    location: location,
    image: allImages.length ? allImages : [],
    country: country,
    category: category,
  };
  const listing = await Listing.findByIdAndUpdate(id, updateListing, {
    new: true,
    runValidators: true,
  });

  console.log("Update listing : ", listing);
  req.flash("success", "Listing updated !");

  res.redirect(`/listings/individual/${id}`);
};

const DeleteListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    throw new ExpressError(403, "Listing not found !");
  }
  console.log("deleted listing : ", listing);
  req.flash("info", "Listing deleted");
  res.redirect("/listings");
};

const categoryListing = async (req, res) => {
  const category = req.params.id;
  const listings = await Listing.find({ category: category });
  if (!listings.length) {
    req.flash("info", `${category} has no listing`);
    return res.redirect("/listings");
  }
  res.render("listing/index.ejs", { data: listings });
};

export {
  AllListings,
  SingleListing,
  CreateListing,
  PostNewListing,
  UpdateListing,
  PutListing,
  DeleteListing,
  categoryListing,
};
