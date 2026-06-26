const mongoose= require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    rollNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    }

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;