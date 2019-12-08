var express = require("express")
var passport = require("passport")
var User = require("../models/user")
var middleware = require("../middleware/index")
var router = express.Router()
router.get("/",function(req,res){
    res.render("home")
})

router.get("/register",function(req,res){
    res.render("auth/register")
})
router.post("/register",function(req,res){
    User.register(new User({username:req.body.username,email:req.body.email,image:req.body.image}),req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message)
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Signed Up Successfully")
                res.redirect("/campgrounds")
            })
        }
    })
})
router.get("/login",function(req,res){
    res.render("auth/login")
})

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){

})

router.get("/logout",function(req,res){
    req.logOut()
    req.flash("success","Successfully Logged Out")
    res.redirect("/campgrounds")
})

router.get("/user/:id",middleware.isloggedin,function(req,res){
    User.findById(req.params.id,function(err,founduser){
        if(err || !founduser){
            req.flash("error","Sorry User Not Found")
            res.redirect("/campgrounds")
        }else{
            res.render("auth/profile",{user:founduser})
        }
    })
})

module.exports = router