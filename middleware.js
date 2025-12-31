const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

// validate listing
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(
            400,
            error.details.map(el => el.message).join(",")
        );
    }
    next();
};

// validate review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(
            400,
            error.details.map(e => e.message).join(",")
        );
    }
    next();
};

//middleware to check login accounts
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(user);//undefined if not logged in
    //console.log(req.path,"..",req.originalUrl);//used to move to edit form if asked to login before editing
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();//call next routes/mmiddlewares if logged in 
};

//to save the redirectUrl
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {//if req.session.redirectUrl!=0 save them as local variable
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//for authorisation for edit/delete listing
const Listing=require("./models/listing");
module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;//find id
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {//to protect unauthorised users from hoopscotch
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

//for authorisation for delete reviews
const Review=require("./models/review");
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id, reviewId } = req.params;//find id
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {//to protect unauthorised users from hoopscotch
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}