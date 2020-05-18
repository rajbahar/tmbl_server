
const mongoose = require("mongoose");

const TambolaLiveSchema = mongoose.Schema({
    Session: {type: Number,required: true},
    Announced: [Number]
  });


// export model user with TambolaLive
module.exports = mongoose.model("TambolaLive", TambolaLiveSchema,'TambolaLive');
