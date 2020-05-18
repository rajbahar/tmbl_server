'use strict'

const UserDetails=require('../Model/UserDetails');

class LuckyDrawService{
    constructor(){}

    *OptLuckyDraw(data){
        return {Success:true,Data:data}
    }

    *SelectLuckyDraw(data){
        return {Success:true,Data:data}
    }
    
    *FetchOptedLuckyDraw(){
        return {Success:true,Data:null}
    }

    *FetchWinners(){
        return {Success:true,Data:null}
    }

}

module.exports=LuckyDrawService;