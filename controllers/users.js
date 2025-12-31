const User = require("../models/user.js");

//Signup ------------------------------------------------------------------------------------
module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
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
};
//-------------------------------------------------------------------------------------------

//Login--------------------------------------------------------------------------------------
module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    // res.redirect("/listings");
    //res.redirect(req.session.redirectUrl);//move to the path just before which you are asked to login
    res.redirect(res.locals.redirectUrl || "/listings");//replace above line as passport make req.user undefined 
};
//--------------------------------------------------------------------------------------------

//Logout
module.exports.logout = (req, res, next) => {
    //callback function by passport
    req.logout((err) => {
        if (err) {
            next(err);
        } else {
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        }
    })
};
//--------------------------------------------------------------------------------------------