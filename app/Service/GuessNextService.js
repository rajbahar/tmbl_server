'use strict'


const UserDetails=require('../Model/UserDetails');

class GuessNextService{
    constructor(){}

    *SelectGuessNext(data){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        if(!userresult)
            return {Success:false,Date:"User not found"}
        
        userresult.GuessNext.push({round:data.round,product:data.GuessNext,answer:false});

        let updateresult = yield UserDetails.findOneAndUpdate({
            Phone:data.Phone,Session:sessionresult.Session
            },{ $set: { GuessNext:userresult.GuessNext } });
            

        return {Success:true,Data:updateresult}
    }

    *SubmitGuessNext(data){
        return {Success:true,Data:data}
    }

}

module.exports=GuessNextService;