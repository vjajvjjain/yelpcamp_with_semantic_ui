const Campground = require("../models/campgrounds")
const Comment = require("../models/comments")
var middleware = {}
middleware.isloggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error","Please Login First")
    res.redirect("/login")
}
middleware.Campathority = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundcampground){
            if(err || !foundcampground){
                req.flash("error","Sorry Campground Not Found")
                res.redirect("/campgrounds")
            }else{
                if(req.user._id.equals(foundcampground.author.id)){
                    next()
                }else{
                    req.flash("error","Sorry You don't have permission to serve this page")
                    res.redirect("/campgrounds")
                }
            }
        })
    }else{
        req.flash("error","please login first")
        res.redirect("/login")
    }
}
middleware.commentAuthority = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundcampground){
            if(err || !foundcampground){
                req.flash("error","Sorry Campground Not Found")
                res.redirect("/campgrounds")
            }else{
                Comment.findById(req.params.cid,function(err,foundcomment){
                    if(err || !foundcomment){
                        req.flash("error","Sorry Comment Not Found")
                        res.redirect("/campgrounds")
                    }else{
                        if(foundcomment.author.id.equals(req.user._id)){
                            next()
                        }else{
                            req.flash("error","Sorry You don't have permission to serve this page")
                            res.redirect("/campgrounds")
                        }
                    }
                })
            }
        })
    }else{
        req.flash("error","Please Login First")
        res.redirect("/login")
    }
}
module.exports = middleware