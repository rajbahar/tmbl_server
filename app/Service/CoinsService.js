'use strict'

const Coins=require('../Model/Coins');
const SessionDetails=require('../Model/Session');
const UserDetails=require('../Model/UserDetails');


class CoinsService{
    constructor(){}

    *DeleteCoins(data){
     
        let result = yield Coins.findOneAndDelete({
           _id:data._id
        });

        if(!result){
            return {Success:false,Data:"Coins not found"}
        }

        return {Success:true,Data:result}

    }

    *UpdateCoins(data){
     
        let result = yield Coins.findOneAndUpdate({
           _id:data._id
        },{ $set: { Coins: data.Coins } });

        if(!result){
            return {Success:false,Data:"Coins not found"}
        }

        return {Success:true,Data:result}

    }

    *SubmitCoins(data){
         let result = new Coins(data);
         yield result.save();

         return {Success:true,Data:result}
 
    }

    *FetchAllCoins(){
        let result=yield Coins.find();
        return {Success:true,Data:result}
    }
}

module.exports=CoinsService;