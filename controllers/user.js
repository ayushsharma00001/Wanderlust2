const User = require("../models/user");
const passport = require("passport");




// To render sign up page
module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
};



// to create user or sign up user
module.exports.signup = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
    const newUser = new User({email:email,username:username});
    const registeredUser = await User.register(newUser,password);
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        }
    });

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


// to render login page
module.exports.renderLoginPage = (req,res)=>{
    res.render("users/login.ejs");
};



// to login user
module.exports.loginUser = async (req,res)=>{
    req.flash("success","Welcome back to wanderlust!");
    redirectLink = res.locals.redirectUrl || "/listings";
    res.redirect(redirectLink);
};


module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","You are logged out");
            res.redirect("/listings");
        }
    })
};
