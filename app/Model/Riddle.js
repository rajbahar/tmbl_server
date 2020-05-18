var mongoose = require("mongoose");
var riddleCollectionSchema = mongoose.Schema({
    question:{required:true,type:String},
    answer:{required:true,type:String},
    options:[{type:String}],
    riddleDate:{type:Date},
    submittedBy:{type:String,required:true},
    submittedDate:{type:Date,default:Date.now}
},{strict:true});

// export model user with UserSchema
module.exports = mongoose.model("riddleCollectionModel",riddleCollectionSchema,'riddleCollection');