'use strict'
const Admin=require('../Model/Admin');
class AdminService{
    constructor(){}

    *Login(data){
        const result=yield Admin.findOne({
            UserName:data.UserName,
            Password:data.Password
        });

        if(!result){
            return {Success:false,Data:"Admin Not Found"}
        }

        let response={
            _id: result._id,
            Name:result.Name,
            Role:"Admin"
        }
         return {Success:true,Data:response}
    }

    *Register(data) {

        let result = yield Admin.findOne({
            UserName: data.UserName
        });

        if (result) {
            return { Success: false, Data: "UserName already exist" }
        }

        result = new Admin(data);

        yield result.save();

        return { Success: true, Data: result }

    }


    *getUserByID(data) {
        const existing = yield Admin.findOne({
            _id: data._id
        });
        if (existing) {
            
            return { Success: true };
        } else {
            return { Success: false };
        }
    }



}

module.exports=AdminService;