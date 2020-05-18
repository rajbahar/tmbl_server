'use strict'


const UserDetails=require('../Model/UserDetails');

class GuessNextService{
    constructor(){}

    *SelectGuessNext(data){
        return {Success:true,Data:data}
    }

    *SubmitGuessNext(data){
        return {Success:true,Data:data}
    }

}

module.exports=GuessNextService;