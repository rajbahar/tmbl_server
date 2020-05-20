'use strict'


const UserDetails=require('../Model/UserDetails');
const SessionDetails=require('../Model/Session');

class GuessNextService{
    constructor(){}

    *SelectGuessNext(data){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        if(!userresult)
            return {Success:false,Data:"User not found"}
        
        userresult.GuessNext.push({round:sessionresult.Round,product:data.GuessNext,answer:false});

        let updateresult = yield UserDetails.findOneAndUpdate({
            Phone:data.Phone,Session:sessionresult.Session
            },{ $set: { GuessNext:userresult.GuessNext } });
            

        return {Success:true,Data:updateresult}
    }

    *SubmitGuessNext(data){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.find({Session:sessionresult.Session,
            GuessNext: {$elemMatch: {round:sessionresult.Round }}
        });
        userresult.forEach(element => {
            if(element.GuessNext[sessionresult.Round].product =data.product)
            {
                console.log("correct answer");
                console.log(element);
                element.GuessNext[sessionresult.Round].answer = true;
            }
            else
            {
                console.log("wrong answer");
            }
        });

        console.log(userresult);

        return {Success:true,Data:data}
    }

    *NextRound(){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        sessionresult.Round = sessionresult.round +1;
        yield SessionDetails.findOneAndUpdate({
            Session:sessionresult.Session
            },{ $set: { Round:sessionresult.Round } 
        });      
        return {Success:true,Data:sessionresult};   
    }

    *CurrentRound(){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        return {Success:true,Data:sessionresult.Round};   
    }  

    *GuessNextNumbers(){
        return {Success:true,Data:null};   
    }

}

module.exports=GuessNextService;