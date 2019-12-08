// SEMANTIC_UI YELPCAMP JUST MADE FOR PRACTICE
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const passportLocal = require("passport-local")
const passportlocalmongoose = require("passport-local-mongoose")
const methodOverride = require("method-override")
const flash = require("connect-flash")
const Campground = require("./models/campgrounds")
const Comment = require("./models/comments")
const User = require("./models/user")
const CampRoute = require("./routes/campground")
const CommentRoute = require("./routes/comments")
const authRoute = require("./routes/auth")
const app = express();
mongoose.connect("mongodb://localhost:27017/semantic_ui",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(flash())
app.use(require("express-session")({
    secret:"chmod a+x mongod",
    resave:false,
    saveUninitialized:false
}))
app.use(methodOverride("_method"))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(function(req,res,next){
    res.locals.current_user = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    return next();
})
app.use("/campgrounds",CampRoute)
app.use("/campgrounds/:id/comments",CommentRoute)
app.use("/",authRoute)
app.listen(process.env.PORT || 3000,process.env.IP)
