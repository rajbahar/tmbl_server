
const mongoose = require("mongoose");

const ZoneSchema = mongoose.Schema({
    Name: {type: String,required: true},
    Min: {type: Number,default: 0},
    Max: {type: Number,default: 0},
    Off: {type:Number, default:0},
    Discount: {type:Number,default:0}   
  });


// export model user with Session
module.exports = mongoose.model("Zone", ZoneSchema,'Zone');
