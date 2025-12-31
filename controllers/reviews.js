const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview=async (req, res) => {
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
};

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};