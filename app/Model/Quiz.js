var mongoose = require("mongoose");
var quizCollectionSchema = mongoose.Schema({
    question:{required:true,type:String},
    answer:{required:true,type:String},
    options:[{type:String}],
    submittedBy:{type:String,required:true},
    submittedDate:{type:Date,default:Date.now}
},{strict:true});

// export model user with UserSchema
module.exports = mongoose.model("quizCollectionModel",quizCollectionSchema,'quizCollection');