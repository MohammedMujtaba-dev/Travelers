import express from "express";
import User from "../models/userModel.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../utils/Middleware.js";
import {
  LoginForm,
  LoginPost,
  LogOut,
  SignUpForm,
  SignUpPost,
} from "../controllers/userControllers.js";
const userRouter = express.Router();


// SINGUP FORM AND POST REQ
userRouter.route("/signup").get(SignUpForm).post(wrapAsync(SignUpPost));

// LOGIN FORM AND POST REQ WITH PASSPORT TO AUTH & LOGIN
userRouter
  .route("/login")
  .get(LoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/auth/login",
      failureFlash: true,
    }),
    LoginPost,
  );

userRouter.get("/logout", LogOut);

export default userRouter;
