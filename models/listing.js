//make the complete model here and export the schema to be used in app.js

const { application, urlencoded } = require("express");
const mongoose = require("mongoose");//Imports the Mongoose ODM library so you can define schemas and models
const Schema = mongoose.Schema;//just to use Schema intead of mongoose.Schemas
const Review = require("./review.js");

//listingSchema describes the shape of a Listing document in MongoDB.
let default_link = "https://www.kayak.co.in/rimg/dimg/dynamic/76/2023/08/eef8369398e2d8ac1191ee20223f219f.webp";
const listingSchema = new Schema({
   title: {
      type: String,
      required: true,
   },
   description: String,

   //set by deafault image

   // image:{ //original
   //  type:String,
   //  default:default_link,//if no image is given
   //  set: (v)=>v===""?default_link:v,//if empty image is given
   // },
   // image: { //edited
   //    type: Object,
   //    default: {
   //       filename: "listingimage",
   //       url: default_link,
   //    },
   // },

   image: {
      url: String,
      filename: String,
   },

   price: Number,
   location: String,
   country: String,
   //to store ids of reviews
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review",//for reference, "Review" model is used
      },
   ],
   owner: {
      type: Schema.Types.ObjectId,
      ref: "User",//for reference , "User" model is used
   },
});

//to delete reviews automatically when  a listing is created
listingSchema.post("findOneAndDelete", async (listing) => {
   if (listing) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
   }
});


//mongoose.model(Modelname, schemaName) compiles a model class based on a schema
const Listing = mongoose.model("Listing", listingSchema);
//1st Listing in above line will hold the Mongoose model object returned by mongoose.model(...).
//You use this variable later: Listing.find(), Listing.create(), new Listing({...}).save().
module.exports = Listing;
//here Listing is the variable, which holds the model
//module.exports is the object that is returned when another file does require("./models/listing")

