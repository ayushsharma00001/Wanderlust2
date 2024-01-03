const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");       // requiring wrapAsync function to handle errors
const {reviewSchema} = require("../schema.js");              // Requiring for mongoose validation if we use any api caller tool for listings
const Listing = require("../models/listing.js");  // requiring listing model or collection from models folder
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");


// post route for reviews

router.post("/",validateReview,isLoggedIn,wrapAsync(reviewcontroller.createReview));

// Delete review route

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewcontroller.destroyReview));

module.exports = router;
