'use strict'

const Jumble= require('../Model/Jumble');
var shuffle = require('shuffle-words');

class JumbleService{
    constructor(){}

    *DeleteJumble(data){
     
        let result = yield Jumble.findOneAndDelete({
           _id:data._id
        });

        if(!result){
            return {Success:false,Data:"Jumble not found"}
        }

        return {Success:true,Data:result}

    }

    *UpdateJumble(data){
     
        let result = yield Jumble.findOneAndUpdate({
           _id:data._id
        },{ $set: { submittedBy: data.submittedBy } });

        if(!result){
            return {Success:false,Data:"Jumble not found"}
        }

        return {Success:true,Data:result}

    }

    *SubmitJumble(data){
         let result = new Jumble(data);
         yield result.save();

         return {Success:true,Data:result}
 
    }

    *FetchAllJumble(){
        let result=yield Jumble.find();
        return {Success:true,Data:result}
    }

    *FetchOneJumble(){
        let result=yield Jumble.findOne({}, {__v:0,submittedBy:0,submittedDate:0});
        var DatatoSend = {
            "_id":result._id,
            "jumbleImage":result.jumbleImage,
            "jumbleWord":shuffle(result.answer, true)
        } 
        console.log(DatatoSend);
        
        return {Success:true,Data:DatatoSend}
    }

    *ValidateJumble(data){
        let result=yield Jumble.findOne({_id:data._id});
        if(!result){
            return {Success:false,Data:"Jumble not found"}
        }
        if(data.answer == result.answer)
        {
            return {Success:true,Date:"Correct Answer"}
        }
        else
        {
            return{Success:false,Data:"Wrong Answer"}
        }
    }
}

module.exports=JumbleService;