import "dotenv/config";
import express from "express";
import { connectDB } from "./db/listings.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import methodOverride from "method-override";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
// import morgan from "morgan";
import listingRouter from "./routes/listingRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import connectFlash from "connect-flash";
import userRouter from "./routes/userRoutes.js";
import passport from "passport";
import User from "./models/userModel.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const plm = require("passport-local");
const LocalStrategy = plm.default || plm;

// const initDB = async () => {
//   await Listing.deleteMany({});
//   const data = sampleListings.map((obj) => ({
//     ...obj,
//     owner: "6ab3aa339768e46c1c243ee7",
//   }));
//   await Listing.insertMany(data);
//   console.log("initialized !");
// };
// initDB();

const app = express();
const port = 8080;
const MONGODB_URL = process.env.MONGODB_URL;
app.listen(port, async () => {
  await connectDB(MONGODB_URL);
  console.log("Server started !");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
// app.use(morgan("combined"));

const store = MongoStore.create({
  mongoUrl: MONGODB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(expressSession(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  // console.log(res.locals);
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/auth", userRouter);

app.all("*catchall", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found !"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "server error" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});
