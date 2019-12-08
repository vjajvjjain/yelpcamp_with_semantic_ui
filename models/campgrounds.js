var mongoose = require("mongoose")
var Comment = require("./comments")
var CampSchema = new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
    location:String,
    lat:Number,
    lng:Number,
    date:{type:Date,default:Date.now},
    comment:[
        id = {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        createdby:String
    }
})
module.exports = mongoose.model("Campground",CampSchema)