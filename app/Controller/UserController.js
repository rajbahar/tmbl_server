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

    *RegisterSimuLate(request,response){
        const data=request.body;
        const result= yield _userService.RegisterSimuLate(data);
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

    *ResendOTP(request,response){
        const data=request.body;
        const result= yield _userService.ResendOTP(data);
        response.json(result);
        response.end();
    }

    *GetProfile(request,response){
        const data=request.query;
        const result= yield _userService.getProfile(data);
        response.json(result);
        response.end();
    }

    *DeleteUser(request,response){
        const data=request.query;
        const result= yield _userService.DeleteUser(data);
        response.json(result);
        response.end();
    }

    *GetEarning(request,response){
        const data=request.query;
        const result= yield _userService.GetEarning(data);
        response.json(result);
        response.end();
    }

    *GetCoinsDetails(request,response){
        const data=request.query;
        const result= yield _userService.GetCoinsDetails(data);
        response.json(result);
        response.end();
    }


    *GetReferralLink(request,response){

        const data=request.query;
        const result= yield _userService.GetReferralLink(data);
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