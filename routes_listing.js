const express = require("express");
const router = express.Router();

//aquire somethings to run all requests------------------------------------------
const wrapAsync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const { validateListing, validateReview } = require("../middleware");
const Listing = require("../models/listing.js");// here . bcz models and app.js are in same floder
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

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//---------------------------------------(CREATE) , these must be placed above READ-------------------------------------------------------------------------------------------------------

// //NEW Route (using GET) to get a form to create new iasting
// app.get("/listings/new", async (req,res)=>{
//     res.render("listings/new.ejs");
// });

//NEW Route (using GET) to get a form to create new listing
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

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

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newlist = new Listing(req.body.listing);
    await newlist.save();
    res.redirect("/listings");
}));

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

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;//find id
    const listing = await Listing.findById(id).populate("reviews");//find and store all data 
    res.render("listings/show.ejs", { listing });
}));
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------(UPDATE)--------------------------------------------------------------------------------------------------------------
//Edit Route (Using GET) to get form to edit/update
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;//find id
    const listing = await Listing.findById(id);//find and store all data 
    res.render("listings/edit.ejs", { listing });
}));

//Update Route (Using PUT) to update after form submission
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;//find id
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //    res.redirect("/listings");
    res.redirect(`/listings/${id}`);
}));


//----------------------------------(DELETE)--------------------------------------------------
//form with button is made inside show.ejs

router.delete("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;//find id
    let deletedList = await Listing.findByIdAndDelete(id);
    //console.log(deletedList);
    res.redirect("/listings");
}));

//-----------------------------------------------------------------------------------------------------------------
module.exports = router;
