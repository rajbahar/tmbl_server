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

         return {Success:true,Data:result}
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



}

module.exports=AdminService;