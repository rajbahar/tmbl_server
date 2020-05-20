'use strict';
const JWT = require('../JWT');
const UserService=require('../Service/UserService');

const _userService=new UserService();
const _jwt = new JWT();

class UserController{
    constructor(){}

    *Login(request,response){
        const data=request.body;
        const result= yield _userService.Login(data);
        response.json(result);
        response.end();
    }

    *Register(request,response){
        const data=request.body;
        const result= yield _userService.Register(data);
        response.json(result);
        response.end();
    }

    *OTP_verify(request,response){
        const data=request.body;
        let result= yield _userService.OTP_verify(data);

        if(result.Success){
            const token = yield _jwt.genrateToken(result.Data); //token generate
            result={Success:true,Token:token,Profile:result.Data};
        }
        response.json(result);
        response.end();
    }

    *GetProfile(request,response){
        const data=request.query;
        const result= yield _userService.getProfile(data);
        response.json(result);
        response.end();
    }

    *List(request,response){
        const result= yield _userService.List();
        response.json(result);
        response.end();
    }
}

module.exports=UserController;