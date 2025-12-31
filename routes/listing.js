const express = require("express");
const router = express.Router();

//to puload images and store in cloudinary
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' })
const upload = multer({storage});//ab file uploads ki jagah cloudinary(storage) mein save hoga, now we can delete uploads folder

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
    .post(isLoggedIn, validateListing,upload.single("listing[image]"), wrapAsync(listingController.createListing));
    // .post(upload.single("listing[image]"),(req,res)=>{
    //     res.send(req.file);
    // });

//---------------------------------------(CREATE)-----------------------------------------------------
//NEW Route (using GET) 
router.get("/new", isLoggedIn, listingController.renderNewForm);
//---------------------------------------------------------------------------------------

router.route("/:id")
    .get(wrapAsync(listingController.showAllListings))
    .put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//--------------------------------------(UPDATE)--------------------------------------------------------------------------------------------------------------
//Edit Route (Using GET) to get form to edit/update
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
//-------------------------------------------------------------------------------------------------

module.exports = router;