var express = require("express")
var Campground = require("../models/campgrounds")
var middleware = require("../middleware/index")
var User = require("../models/user")


var router = express.Router()
router.get("/",function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name:regex},function(err,foundcampground){
            if(err){
                req.flash("error","Sorry Something went Wrong")
                res.redirect("/campgrounds")
            }else{
                if(foundcampground.length<1){
                    req.flash("error","Sorry No Campground Found !")
                    res.redirect("/campgrounds")
                }else{
                    res.render("campgrounds/index",{campground:foundcampground})
                }
            }
        })
    }else{
        Campground.find({},function(err,foundcampground){
            if(err){
                req.flash("error","Sorry Something went Wrong")
                res.redirect("/campgrounds")
            }else{
                res.render("campgrounds/index",{campground:foundcampground})
            }
        })
    }
})

router.post("/",middleware.isloggedin,function(req,res){
    Campground.create(req.body.campground,function(err,foundcampground){
        if(err){
            req.flash("error","Sorry Something went Wrong")
            res.redirect("/campgrounds")
        }else{
            foundcampground.author.createdby = req.user.username
            foundcampground.author.id = req.user._id
            foundcampground.save()
            req.user.campcreated.push(foundcampground)
            req.flash("success","Campground Created Succesfully")
            res.redirect("/campgrounds")
        }
    })
})

router.get("/new",middleware.isloggedin,function(req,res){
    res.render("campgrounds/new")
})

router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comment").exec(function(err,foundcampground){
        if(err || !foundcampground){
            req.flash("error","Sorry Campground Not Found")
            res.redirect("/campgrounds")
        }else{
            res.render("campgrounds/show",{campground:foundcampground})
        }
    })
})

router.get("/:id/edit",middleware.Campathority,function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
        if(err || !foundcampground){
            req.flash("error","Sorry Campground Not Found")
            res.redirect("/campgrounds")
        }else{
            res.render("campgrounds/edit",{campground:foundcampground})
        }
    })
})

router.put("/:id",middleware.Campathority,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,editedcampground){
        if(err){
            req.flash("error","Sorry Something went Wrong")
            res.redirect("/campgrounds")
        }else{
            req.flash("success","Campground Updated Succesfully")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

router.delete("/:id",middleware.Campathority,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error","Sorry Something went Wrong")
            res.redirect("/campgrounds")
        }else{
            req.flash("success","Campground Deleted Succesfully !")
            res.redirect("/campgrounds")
        }
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router