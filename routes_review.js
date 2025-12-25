const express = require("express");
const { route } = require("./listing");
// const router = express.Router();
const router = express.Router({mergeParams:true});
//just to use id when id passes from app.js to review.js

//aquire somethings to run all requests------------------------------------------
const wrapAsync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { validateListing, validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
//--------------------------------------------------------------------------------

//reviews-->>post route
router.post("/",isLoggedIn,  validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);//find id of listing
    let newReview = new Review(req.body.review);//Here, "Review" is the model acquired from review.js 
    newReview.author=req.user._id;
    listing.reviews.push(newReview);//add newreview 
    await newReview.save();
    await listing.save();

    // console.log("New review saved");
    // res.send("New review added");
    req.flash("success","New review added!");
    res.redirect(`/listings/${listing._id}`);//wapas usi page pe aa jaoge review submit karne ke baad
}));

//reviews-->>delete route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
