'use strict'

const User=require('../Model/User');

class UserService{
    constructor(){}

    *Login(data){
     
        let result = yield User.findOne({
           Email:data.Email
        });

        if(!result){
            return {Success:false,Data:"User not found"}
        }

        return {Success:true,Data:result}

    }

    *Register(data){
        let result = yield User.findOne({
            Email:data.Email
         });
 
         if(result){
             return {Success:false,Data:"User already exist"}
         }

         result = new User(data);
         yield result.save();

         return {Success:true,Data:result}
 
    }

    *List(){
        let result=yield User.find();
        return {Success:true,Data:result}
    }
}

module.exports=UserService;