if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}






const express = require("express");           // Requiring express package
const MongoStore = require('connect-mongo');
const app = express();
const mongoose = require("mongoose");         // Requiring Mongoose package
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extnded:true}));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const ExpressError = require("./utils/ExpressError.js");       // requiring ExpressError class to show our custom errors error page
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const LocalStratagy = require("passport-local");
const User = require("./models/user.js");


// requiring and using connect-flash and express-session
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const dbUrl = process.env.ATLASDB_URL
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    tuchAfter:24*3600

});


store.on("error",()=>{
    console.log("Error occured on Mongo session store",err);
})
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"HelloWorld");
//     res.send(registeredUser);
// })

// using routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);









// Connecting to Database 
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

// Error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went Wrong"} =err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
});

// Listening server on a port
app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});
// test listing route - it is just for adding sample data and test
// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"calangute, Goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successfull");
// });