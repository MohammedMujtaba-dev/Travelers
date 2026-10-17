import mongoose from "mongoose";
import { Schema } from "mongoose";

import passportLocalMongoose from "passport-local-mongoose";

// import { createRequire } from "module";

// const require = createRequire(import.meta.url);

// const plm = require("passport-local-mongoose");
// const passportLocalMongoose = plm.default || plm;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose.default);
const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;
