const express = require("express");
const router = express.Router();
//require User Model
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport=require("passport");

//give the form to signup
router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
});

//signup on DB
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;//extrct detils frorm form
        const newUser = new User({ email, username });
        await User.register(newUser, password);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");//come to homepage after addition of newuser
    } catch (e) {
        req.flash("error", e.message);//flash error on same page
        res.redirect("/signup");
    }
}));

//give the form to login
router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
});

//login on DB
router.post("/login",
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/listings");
    }
);

module.exports = router;

