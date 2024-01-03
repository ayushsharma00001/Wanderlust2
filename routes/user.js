const express = require("express");
const router = express.Router();
const User = require("../models/user.js");  // requiring User model or collection from models folder
const wrapAsync = require("../utils/wrapAsync.js");       // requiring wrapAsync function to handle errors
const {listingSchema} = require("../schema.js");  
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");




router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginPage)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.loginUser));


router.get("/logout",userController.logoutUser);


module.exports = router;