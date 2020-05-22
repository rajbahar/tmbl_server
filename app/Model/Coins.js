var mongoose = require("mongoose");
var coinsCollectionSchema = mongoose.Schema({
    Game:{required:true,type:String},
    Coins:{type:Number ,required:true},
    Quota:{type:Number ,required:true},
    submittedDate:{type:Date,default:Date.now}
},{strict:true});

// export model user with UserSchema
module.exports = mongoose.model("coinsCollectionModel",coinsCollectionSchema,'coinsCollection');