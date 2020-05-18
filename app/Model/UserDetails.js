
const mongoose = require("mongoose");

const UserDetailsSchema = mongoose.Schema({
    Phone: { type: String, required: true},
    Session: {type: Number,required: true},
    Quiz: [{_id: Object,answer:Boolean}],
    Riddle: [{_id: Object,answer:Boolean}],
    Jumble: [{_id: Object,answer:Boolean}],
    GuessNext: [{round:Number,product:Number,answer:Boolean}],
    TambolaTicketNumber:  { type: Number, required: true},
    TambolaTicket:{first:[Number],second:[Number],third:[Number]},
    LuckyDraw:{opt:Boolean,win:Boolean}
  });


// export model user with UserDetailsSchema
module.exports = mongoose.model("UsersDetails", UserDetailsSchema,'UsersDetails');
