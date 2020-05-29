var mongoose = require("mongoose");
var YouTube = mongoose.Schema({
    
    Link:{type:String ,required:true},
    createdAt: {type: Date,default: Date.now()}

},{strict:true});

// export model user with UserSchema
module.exports = mongoose.model("YouTube",YouTube,'YouTube');