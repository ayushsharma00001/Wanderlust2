const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// Connecting to Database 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err);
});



// inserting Data
const initDB = async()=>{
    initData.data = initData.data.map((obj)=>({...obj , owner:"654a1e9d6489797a6e785ecc"}))
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized");
}

initDB();