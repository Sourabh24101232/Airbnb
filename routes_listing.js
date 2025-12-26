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

//index route--> to get all data -----------------------------------------------------------------------------------------------------------------------------
//Airbnb nodemon app.js --> run server suing this on terminal
//run localhost:8080/listings on chrome
// app.get("/listings",(req,res)=>{
//    Listing.find({})
//    .then((res)=>{
//     console.log(res);
//    });
// });

//--------------------------------------------------------------------------------------------------------------
// app.get("/listings",async (req,res)=>{
//     const allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// });

router.get("/", wrapAsync(listingController.index));

//---------------------------------------(CREATE) , these must be placed above READ-------------------------------------------------------------------------------------------------------

// //NEW Route (using GET) to get a form to create new iasting
// app.get("/listings/new", async (req,res)=>{
//     res.render("listings/new.ejs");
// });

//NEW Route (using GET) to get a form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//CREATE route (Using POST) to create listing after submitting form of NEW route
// app.post("/listings", async (req, res) => {
//     // let {title,desc,image,price,location,country}=req.body;
//     const newlist = new Listing(req.body.listing);
//     await newlist.save();
//     // console.log(newlist);
//     res.redirect("/listings");
// });

// app.post("/listings", async (req, res,next) => {
//     try{
//     const newlist = new Listing(req.body.listing);
//     await newlist.save();
//     res.redirect("/listings");
//     }catch(err){
//         next(err);//call to error handling middleware at end of app.js
//     }
// });

router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// app.post("/listings", wrapAsync(async (req, res, next) => {
//     // listingschema.validate(req.body);
//     let result=listingschema.validate(req.body);
//     console.log(result);
//     if(!req.body.listing) {
//         throw new ExpressError(400,"Send Valid data for listing");
//     }
//     const newlist = new Listing(req.body.listing);
//     // if(!newlist.description) {
//     //     throw new ExpressError(400,"Description is missing");
//     // }
//     //Har filed ke liye uparwala code nhi likhna padega, joi dekh lega
//     await newlist.save();
//     res.redirect("/listings");
// }));


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------(Read,GET request)----------------------------------------------------------------------------------------------------------
//Show Route
// app.get("/listings/:id",async (req,res)=>{
//     let {id}=req.params;//find id
//     const listing=await Listing.findById(id);//find and store all data 
//     res.render("listings/show.ejs",{listing});
// });

router.get("/:id", wrapAsync(listingController.showAllListings));
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------(UPDATE)--------------------------------------------------------------------------------------------------------------
//Edit Route (Using GET) to get form to edit/update
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route (Using PUT) to update after form submission
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


//----------------------------------(DELETE)--------------------------------------------------
//form with button is made inside show.ejs

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
//-----------------------------------------------------------------------------------------------------------------


module.exports = router;
