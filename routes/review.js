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
const reviewController= require("../controllers/reviews.js");
//--------------------------------------------------------------------------------

//reviews-->>post route , create new review
router.post("/",isLoggedIn,  validateReview, wrapAsync(reviewController.createReview));

//reviews-->>delete route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;