'use strict'

const UserDetails=require('../Model/UserDetails');
const SessionDetails=require('../Model/Session');

class LuckyDrawService{
    constructor(){}

    *OptLuckyDraw(data){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        if(!userresult)
            return {Success:false,Data:"User not found"}
        
        yield UserDetails.findOneAndUpdate({
            Phone:data.Phone,Session:sessionresult.Session
            },{ $set: { LuckyDraw:{opt:true,win:false} } });
            
        let updateresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        return {Success:true,Data:updateresult}
    }

    *SelectLuckyDraw(data){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        if(!userresult)
            return {Success:false,Data:"User not found"}
        
        yield UserDetails.findOneAndUpdate({
            Phone:data.Phone,Session:sessionresult.Session
            },{ $set: { LuckyDraw:{opt:true,win:true} } });

        let updateresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        return {Success:true,Data:updateresult}
    }
    
    *FetchOptedLuckyDraw(){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.find({ Session:sessionresult.Session,
            'LuckyDraw.opt': true
            });
        console.log(userresult);
        return {Success:true,Data:userresult}
    }

    *FetchWinners(){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])

        let userresult=yield UserDetails.find({ Session:sessionresult.Session,
            'LuckyDraw.win': true
            });
        return {Success:true,Data:userresult}
    }

}

module.exports=LuckyDrawService;