const express = require("express");
const router = express.Router();
//require User Model
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users.js");

//give the form to signup
router.get("/signup", userController.renderSignupForm);

//signup on DB
router.post("/signup", wrapAsync(userController.signup));

//give the form to login
router.get("/login", userController.renderLoginForm);

//login on DB
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

//logout
router.get("/logout", userController.logout);


module.exports = router;

