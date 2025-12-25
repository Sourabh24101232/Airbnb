const express = require("express");
const router = express.Router();
//require User Model
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware")

//give the form to signup
router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
});

//signup on DB
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;//extrct detils frorm form
        const newUser = new User({ email, username });
        let RegisteredUser = await User.register(newUser, password);

        //to login automatically after signup
        req.login(RegisteredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");//come to homepage after addition of newuser
        });

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
router.post("/login", saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), (req, res) => {
        req.flash("success", "Welcome back!");
        // res.redirect("/listings");
        //res.redirect(req.session.redirectUrl);//move to the path just before which you are asked to login
        res.redirect(res.locals.redirectUrl || "/listings");//replace above line as passport make req.user undefined 
    }
);

//logout
router.get("/logout", (req, res, next) => {
    //callback function by passport
    req.logout((err) => {
        if (err) {
            next(err);
        } else {
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        }
    })
});

module.exports = router;

