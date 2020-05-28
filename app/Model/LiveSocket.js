var mongoose = require("mongoose");
var liveSocketCollectionSchema = mongoose.Schema({
    SocketID:{type:String ,required:true}
},{strict:true});

// export model user with UserSchema
module.exports = mongoose.model("liveSocketCollectionModel",liveSocketCollectionSchema,'liveSocketCollection');