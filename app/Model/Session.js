
const mongoose = require("mongoose");

const SessionSchema = mongoose.Schema({
    Session: {type: Number,required: true},
    Date: {type:Date,default:Date.now}
  });


// export model user with Session
module.exports = mongoose.model("Session", SessionSchema,'Session');
