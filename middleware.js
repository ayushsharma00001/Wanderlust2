module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
    // console.log(req.path , "     " , req.originalUrl);
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in before performing actions");
        return res.redirect("/login");
    }   
    else{
        next();
    }
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        
    }
    next();
}



const Listing = require("./models/listing.js");  // requiring listing model or collection from models folder
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You dont have permission to edit or delete this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


const {listingSchema,reviewSchema} = require("./schema.js");              // Requiring for mongoose validation if we use any api caller tool for listings
const ExpressError = require("./utils/ExpressError.js");       // requiring ExpressError class to show our custom errors error page


module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }
    else{
        next();
    }
}

// REVIEWS
// validating review data
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }
    else{
        next();
    }
}


const Review = require("./models/review.js");
module.exports.isAuthor = async (req,res,next)=>{
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){   // res.locals.currUser._id
        req.flash("error","You did not created this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}