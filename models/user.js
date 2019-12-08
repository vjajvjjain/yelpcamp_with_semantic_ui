var mongoose = require("mongoose")
var passportlocalmongoose = require("passport-local-mongoose")
var Campground = require("./campgrounds")
var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    image:String,
    campcreated:[
        id = {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Campground"
        }
    ]
})
UserSchema.plugin(passportlocalmongoose)
module.exports = mongoose.model("User",UserSchema)