const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//create--------------------------------------------------------------------------------
module.exports.renderNewForm=async (req, res) => {//pass middleware isLoggedIn to check if user is logged in or not
    res.render("listings/new.ejs");
};

module.exports.createListing=async (req, res, next) => {
    if (!req.body.listing.image?.url) delete req.body.listing.image;// must be BEFORE new Listing()

    const newlist = new Listing(req.body.listing);
    newlist.owner = req.user._id;//to assign owner name of newlist created=username
    await newlist.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};
//-----------------------------------------------------------------------------------------

//Read-------------------------------------------------------------------------------------
module.exports.showAllListings=async (req, res) => {
    let { id } = req.params;//find id
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");//find and store all data 
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};
//-------------------------------------------------------------------------------------------

//update--------------------------------------------------------------------------------------
module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;//find id
    const listing = await Listing.findById(id);//find and store all data 
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing=async (req, res) => {
    if (!req.body.listing.image?.url) delete req.body.listing.image;
    
    let { id } = req.params;//find id
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //    res.redirect("/listings");
    res.redirect(`/listings/${id}`);
};
//------------------------------------------------------------------------------------------

//Delete------------------------------------------------------------------------------------
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;//find id
    let deletedList = await Listing.findByIdAndDelete(id);
    //console.log(deletedList);
    res.redirect("/listings");
};
