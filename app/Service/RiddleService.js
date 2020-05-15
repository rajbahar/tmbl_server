'use strict'

const Riddle=require('../Model/Riddle');

class RiddleService{
    constructor(){}

    *DeleteRiddle(data){
     
        let result = yield Riddle.findOneAndDelete({
           _id:data._id
        });

        if(!result){
            return {Success:false,Data:"Riddle not found"}
        }

        return {Success:true,Data:result}

    }

    *UpdateRiddle(data){
     
        let result = yield Riddle.findOneAndUpdate({
           _id:data._id
        },{ $set: { submittedBy: data.submittedBy } });

        if(!result){
            return {Success:false,Data:"Riddle not found"}
        }

        return {Success:true,Data:result}

    }

    *SubmitRiddle(data){
         let result = new Riddle(data);
         yield result.save();

         return {Success:true,Data:result}
 
    }

    *FetchAllRiddle(){
        let result=yield Riddle.find();
        return {Success:true,Data:result}
    }

    *FetchOneRiddle(){
        let result=yield Riddle.findOne({}, {__v:0,submittedBy:0,submittedDate:0,answer:0});
        
        return {Success:true,Data:result}
    }

    *ValidateRiddle(data){
        let result=yield Riddle.findOne({_id:data._id});
        if(!result){
            return {Success:false,Data:"Riddle not found"}
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

module.exports=RiddleService;