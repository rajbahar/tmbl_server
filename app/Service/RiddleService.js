'use strict'
const User= require('../Model/User');
const Riddle=require('../Model/Riddle');
const Coins=require('../Model/Coins');
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
        // console.log(data)
        data.options=data.options.split(',');
        // console.log(data)
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

        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session
        });
        console.log(userresult);
        if(userresult.Riddle.length > 0)
            return {Success:false,Data:"You have already played the riddle."}

        let result=yield Riddle.findOne({
            "riddleDate": {"$gte": today.toDate(), "$lt": moment(today).endOf('day').toDate()}
        }, {__v:0,submittedBy:0,submittedDate:0,answer:0});
        if(!result)
            return {Success:false,Data:"No Riddle Today"}       

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
            return {Success:false,Data:"User not found"}
        
        if(!userresult.Riddle)
            userresult.Riddle= [];
        if(data.answer == result.answer)
        {
                userresult.Riddle.push({_id:result._id,answer:true})
                console.log(userresult.Riddle);
                let updateresult = yield UserDetails.findOneAndUpdate({
                    Phone:data.Phone,Session:sessionresult.Session
                },{ $set: { Riddle: userresult.Riddle } });

                //add riddle coin
                let existingUser = yield User.findOne({
                    Phone: data.Phone
                });
                let c= yield Coins.findOne({ Game: 'Riddle'});
                if(c){
                    existingUser.coins= (existingUser.coins+c.Coins);

                    let RiddleFound=false;
                    for (let index = 0; index < existingUser.AllCoins.length; index++) {
                        const element = existingUser.AllCoins[index];
                        if (element.Game == 'Riddle') {
                            RiddleFound=true;
                            existingUser.AllCoins[index].Coin = existingUser.AllCoins[index].Coin + c.Coins;
                        }
                    }
                    if(RiddleFound==false){
                        existingUser.AllCoins.push({ Game: 'Riddle', Coin: c.Coins });
                    }
                }
                yield existingUser.save();
            
            return {Success:true,Data:"CONGRATS! YOU HAVE WON "+c.Coins+" COINS"}
        }
        else
        {
            userresult.Riddle.push({_id:result._id,answer:false})
            console.log(userresult.Riddle);
            let updateresult = yield UserDetails.findOneAndUpdate({
                Phone:data.Phone,Session:sessionresult.Session
            },{ $set: { Riddle: userresult.Riddle } });
            
            return{Success:false,Data:"OOPS! YOU GOT THE WRONG ANSWER"}
        }
    }
}

module.exports=RiddleService;