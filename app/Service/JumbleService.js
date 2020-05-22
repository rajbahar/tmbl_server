'use strict'

const Coins= require('../Model/Coins');
const User= require('../Model/User');
const Jumble= require('../Model/Jumble');
const shuffle = require('shuffle-words');
const moment = require('moment');
const SessionDetails=require('../Model/Session');
const UserDetails=require('../Model/UserDetails');

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
         result.jumbleDate = new Date(result.jumbleDate);
         yield result.save();

         return {Success:true,Data:result}
 
    }

    *FetchAllJumble(){
        let result=yield Jumble.find();
        return {Success:true,Data:result}
    }

    *FetchOneJumble(data){
        const today = moment().startOf('day')
        
        let result=yield Jumble.findOne({
            "jumbleDate": {"$gte": today.toDate(), "$lt": moment(today).endOf('day').toDate()}
        }, {__v:0,submittedBy:0,submittedDate:0});
        if(!result)
            return {Success:false,Data:"No Jumble Today"}

        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session,
        Jumble: {$elemMatch: {_id: result._id}}
        });
        console.log(userresult);
        if(userresult)
            return {Success:false,Data:"You have already played the jumble. Come back tomorrow"}

        var DatatoSend = {
            "_id":result._id,
            "jumbleImage":result.jumbleImage,
            "jumbleWord":shuffle(result.answer, true)
        } 
        console.log(result);
        
        return {Success:true,Data:DatatoSend}
    }

    *ValidateJumble(data){
        let result=yield Jumble.findOne({_id:data._id});
        if(!result){
            return {Success:false,Data:"Jumble not found"}
        }
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        if(!userresult)
            return {Success:false,Data:"User not found"}
        
        if(!userresult.Jumble)
            userresult.Jumble= [];
        if(data.answer == result.answer)
        {

                userresult.Jumble.push({_id:result._id,answer:true})
                console.log(userresult.Jumble);
                let updateresult = yield UserDetails.findOneAndUpdate({
                    Phone:data.Phone,Session:sessionresult.Session
                },{ $set: { Jumble: userresult.Jumble } });
            
                //add jumble coins
                let existingUser = yield User.findOne({
                    Phone: data.Phone
                });
                let c= yield Coins.findOne({ Game: 'Jumble'});
                if(c){
                    existingUser.coins= (existingUser.coins+c.Coins)
                }
                yield existingUser.save();

            return {Success:true,Data:"Correct Answer"}
        }
        else
        {
            userresult.Jumble.push({_id:result._id,answer:false})
            console.log(userresult.Jumble);
            let updateresult = yield UserDetails.findOneAndUpdate({
                Phone:data.Phone,Session:sessionresult.Session
            },{ $set: { Jumble: userresult.Jumble } });
            
            return{Success:false,Data:"OPPS! You Got the Wrong Answer"}
        }
    }
}

module.exports=JumbleService;