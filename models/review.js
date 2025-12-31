const express = require("express");
const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//make structure of review
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),//by default current time
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

//export model ="Review" with schema=reviewSchema
module.exports=mongoose.model("Review",reviewSchema);

