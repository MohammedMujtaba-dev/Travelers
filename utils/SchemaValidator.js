import Joi from "joi";

const reviewSchema = Joi.object({
  comment: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
}).required();

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  category: Joi.string().required(),
  image: Joi.array().items(Joi.string().allow("", null)).single(),
}).required();
export { reviewSchema, listingSchema };
