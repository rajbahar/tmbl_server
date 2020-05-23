
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Phone: {
    type: String,
    required: true
  },
  City: {
    type: String,
    required: true
  },
  OTP: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  coins:{
    type:Number,
    default:0
  },
  MaxCount:{
    type:Number,
    default:0
  },
  AllCoins:[{Game: String,Coin:Number}]

});

// export model user with UserSchema
module.exports = mongoose.model("Users", UserSchema,'Users');