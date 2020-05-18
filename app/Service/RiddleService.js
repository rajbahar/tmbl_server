'use strict'

const Riddle=require('../Model/Riddle');
const moment = require('moment');
const SessionDetails=require('../Model/Session');
const UserDetails=require('../Model/UserDetails');


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

    *FetchOneRiddle(data){
        const today = moment().startOf('day')


        let result=yield Riddle.findOne({
            "riddleDate": {"$gte": today.toDate(), "$lt": moment(today).endOf('day').toDate()}
        }, {__v:0,submittedBy:0,submittedDate:0,answer:0});
        if(!result)
            return {Success:false,Data:"No Riddle Today"}

        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session,
        Riddle: {$elemMatch: {_id: result._id}}
        });
        console.log(userresult);
        if(userresult)
            return {Success:false,Date:"You have already played the quiz. Come back tomorrow"}

        return {Success:true,Data:result}
    }

    *ValidateRiddle(data){
        let result=yield Riddle.findOne({_id:data._id});
        if(!result){
            return {Success:false,Data:"Riddle not found"}
        }
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        if(!userresult)
            return {Success:false,Date:"User not found"}
        
        if(!userresult.Riddle)
            userresult.Riddle= [];
        if(data.answer == result.answer)
        {
                userresult.Riddle.push({_id:result._id,answer:true})
                console.log(userresult.Riddle);
                let updateresult = yield UserDetails.findOneAndUpdate({
                    Phone:data.Phone,Session:sessionresult.Session
                },{ $set: { Riddle: userresult.Riddle } });
            
            return {Success:true,Date:"Correct Answer"}
        }
        else
        {
            userresult.Riddle.push({_id:result._id,answer:true})
            console.log(userresult.Riddle);
            let updateresult = yield UserDetails.findOneAndUpdate({
                Phone:data.Phone,Session:sessionresult.Session
            },{ $set: { Riddle: userresult.Riddle } });
            
            return{Success:false,Data:"Wrong Answer"}
        }
    }
}

module.exports=RiddleService;