import User from "../models/userModel.js";
const SignUpForm = (req, res) => {
  res.render("user/signup.ejs");
};

const SignUpPost = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      email: email,
      username: username,
    });
    const registeredUser = await User.register(newUser, password);
    const user = await User.findOne({ username: username });
    console.log("registerd user : ", registeredUser);
    // console.log("user : ", user);
    // // signupid = user._id;
    // // console.log(signupid);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Registered Successfully");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/auth/signup");
  }
};

const LoginForm = async (req, res) => {
  // const user = await User.findOne({ _id: signupid });
  // console.log(user);
  res.render("user/login.ejs");
};

const LoginPost = async (req, res) => {
  req.flash("success", "Welcome to travelers");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  if (res.locals.originalMethod === "POST") {
    return res.redirect("/listings");
  }
  res.redirect(redirectUrl);
};

const LogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out !");
    res.redirect("/listings");
  });
};
export { SignUpForm, SignUpPost, LoginForm, LoginPost, LogOut };
