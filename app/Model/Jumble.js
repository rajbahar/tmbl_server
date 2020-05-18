var mongoose = require("mongoose");
var jumbleCollectionSchema = mongoose.Schema({
    answer:{required:true,type:String},
    jumbleDate:{type:Date,required:true},
    submittedBy:{type:String,required:true},
    submittedDate:{type:Date,default:Date.now},
    jumbleImage:{type:String,required:true}
},{strict:true});

// export model user with UserSchema
module.exports = mongoose.model("jumbleCollectionModel",jumbleCollectionSchema,'jumbleCollection');