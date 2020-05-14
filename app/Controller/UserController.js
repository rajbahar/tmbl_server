'use strict';
const UserService=require('../Service/UserService');
const _userService=new UserService();

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

    *List(request,response){
        const result= yield _userService.List();
        response.json(result);
        response.end();
    }
}

module.exports=UserController;