const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//create--------------------------------------------------------------------------------
module.exports.renderNewForm = async (req, res) => {//pass middleware isLoggedIn to check if user is logged in or not
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing.image?.url) delete req.body.listing.image;// must be BEFORE new Listing()

    let url = req.file.path;
    let filename = req.file.filename;

    const newlist = new Listing(req.body.listing);
    newlist.image = { url, filename };//give url and filename to new listing 
    newlist.owner = req.user._id;//to assign owner name of newlist created=username
    await newlist.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
};
//-----------------------------------------------------------------------------------------

//Read-------------------------------------------------------------------------------------
module.exports.showAllListings = async (req, res) => {
    let { id } = req.params;//find id
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");//find and store all data 
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};
//-------------------------------------------------------------------------------------------

//update--------------------------------------------------------------------------------------
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;//find id
    const listing = await Listing.findById(id);//find and store all data 
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }

    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/w_250");//change pixels of image during preview in edit form
    res.render("listings/edit.ejs", { listing ,originalimageurl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;//find id
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {//update only  if you are uploading any image
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };//give url and filename to listing  to update
        await listing.save();
    }
 
    req.flash("success", "Listing Updated");
    //    res.redirect("/listings");
    res.redirect(`/listings/${id}`);
};
//------------------------------------------------------------------------------------------

//Delete------------------------------------------------------------------------------------
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;//find id
    let deletedList = await Listing.findByIdAndDelete(id);
    //console.log(deletedList);
    res.redirect("/listings");
};
