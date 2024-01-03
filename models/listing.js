const mongoose = require("mongoose");         // Requiring Mongoose package
const Schema = mongoose.Schema;

const Review = require("./review.js");

const listingSchema = new Schema({            // Creating a schema for Listing collection in wanderlust database
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url: String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})




// creating a model which is collection 
const Listing = mongoose.model("Listing",listingSchema);
// Exporting Listing model
module.exports = Listing;