const express = require("express");
const router = express.Router();

//aquire somethings to run all requests------------------------------------------
const wrapAsync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { validateListing, validateReview, isLoggedIn, isOwner } = require("../middleware");
const Listing = require("../models/listing.js");// here . bcz models and app.js are in same floder
const listingController = require("../controllers/listings.js");
//--------------------------------------------------------------------------------

// router.get("/", wrapAsync(listingController.index));
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//---------------------------------------(CREATE)-----------------------------------------------------
//NEW Route (using GET) 
router.get("/new", isLoggedIn, listingController.renderNewForm);
//---------------------------------------------------------------------------------------

router.route("/:id")
    .get(wrapAsync(listingController.showAllListings))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//--------------------------------------(UPDATE)--------------------------------------------------------------------------------------------------------------
//Edit Route (Using GET) to get form to edit/update
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
//-------------------------------------------------------------------------------------------------

module.exports = router;
