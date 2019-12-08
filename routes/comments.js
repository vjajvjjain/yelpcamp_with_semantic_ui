var express = require("express")
var Campground = require("../models/campgrounds")
var Comment = require("../models/comments")
var middleware = require("../middleware/index")
var router = express.Router({mergeParams:true})
router.get("/new",middleware.isloggedin,function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
        if(err || !foundcampground){
            req.flash("error","Sorry Campground Not Found")
            res.redirect("/campgrounds")
        }else{
            res.render("comments/new",{campground:foundcampground})
        }
    })
})
router.post("/",middleware.isloggedin,function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
        if(err || !foundcampground){
            req.flash("error","Sorry Campground Not found")
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment,function(err,foundcomment){
                if(err || !foundcomment){
                    req.flash("error","Sorry Something went wrong")
                    res.redirect("/campgrounds")
                }else{
                    foundcomment.author.username = req.user.username
                    foundcomment.author.id = req.user._id
                    foundcomment.save()
                    foundcampground.comment.push(foundcomment)
                    foundcampground.save()
                    console.log(req.user)
                    req.flash("success","New Comment Added")
                    res.redirect("/campgrounds/"+req.params.id)
                }
            })
        }
    })
})
router.get("/:cid/edit",middleware.commentAuthority,function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
        if(err || !foundcampground){
            req.flash("error","Sorry Campground Not found")
            res.redirect("/campgrounds")
        }else{
            Comment.findById(req.params.cid,function(err,foundcomment){
                if(err || !foundcomment){
                    req.flash("error","Sorry Campground Not found")
                    res.redirect("/campgrounds")
                }else{
                    res.render("comments/edit",{campground:foundcampground,comment:foundcomment})
                }
            })        
        }
    })
})
router.put("/:cid",middleware.commentAuthority,function(req,res){
    Comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err,updatedcomment){
        if(err){
            req.flash("error","Sorry Something Went Wrong")
            res.redirect("/campgrounds")
        }else{
            req.flash("success","Comment Updated Successfully")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})
router.delete("/:cid",middleware.commentAuthority,function(req,res){
    Comment.findByIdAndRemove(req.params.cid,function(err){
        if(err){
            req.flash("error","Sorry Something Went Wrong")
            res.redirect("/campgrounds")
        }else{
            req.flash("success","Comment Succesfully Deleted")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

module.exports = router