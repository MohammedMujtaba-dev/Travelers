import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listingModel.js";
import ExpressError from "../utils/ExpressError.js";
import { isOwner, loggedIn, validatelisting } from "../utils/Middleware.js";
import {
  AllListings,
  categoryListing,
  CreateListing,
  DeleteListing,
  PostNewListing,
  PutListing,
  SingleListing,
  UpdateListing,
} from "../controllers/listingControllers.js";

import { storage } from "../cloudConfig.js";
import multer from "multer";
const upload = multer({ storage });

const listingRouter = express.Router();

//   READ
listingRouter.get("/", wrapAsync(AllListings));

// READ SINGLE LISTING
listingRouter.get("/individual/:id", wrapAsync(SingleListing));

// NEW LISTING
listingRouter
  .route("/new")
  //   CREATE FORM
  .get(loggedIn, CreateListing)
  // POST REQ FOR CREATE
  .post(
    loggedIn,
    upload.array("image", 5),
    validatelisting,
    wrapAsync(PostNewListing),
  );

// UPDATE LISTING
listingRouter
  .route("/edit/:id")
  // EDIT FORM
  .get(loggedIn, isOwner, wrapAsync(UpdateListing))
  // PUT REQ FOR UPDATE
  .put(
    loggedIn,
    isOwner,
    upload.array("image", 5),
    validatelisting,
    wrapAsync(PutListing),
  );

// DELETE
listingRouter.delete("/:id", loggedIn, isOwner, wrapAsync(DeleteListing));

// CATEGORY
listingRouter.get("/category/:id", wrapAsync(categoryListing));
export default listingRouter;
