import mongoose from "mongoose";
import { Schema } from "mongoose";
import Review from "./reviewsModel.js";
const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      default: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR86kczML_kdfQjmwvRHp1IZCPFbH-HGah5_aV20HwoBw&s=10",
      ],
      set: (v) =>
        Array.isArray(v) && v.length
          ? v
          : [
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR86kczML_kdfQjmwvRHp1IZCPFbH-HGah5_aV20HwoBw&s=10",
            ],
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    category: {
      type: String,
      enum: [
        "rooms",
        "cabins",
        "mountains",
        "pools",
        "camping",
        "castles",
        "arctic",
        "domes",
        "boats",
        "farms",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ListingSchema.post("findOneAndDelete", async (data) => {
  if (data && data.reviews.length) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

const Listing =
  mongoose.models.listing || mongoose.model("listing", ListingSchema);
export default Listing;
