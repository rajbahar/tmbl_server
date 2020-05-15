'use strict';
const JWT = require('../JWT');
const AdminService=require('../Service/AdminService');

const _adminService=new AdminService();
const _jwt = new JWT();

class AdminController{
    constructor(){}

    *Login(request,response){
        const data=request.body;
        var result= yield _adminService.Login(data);
        if(result.Success){
            const token = yield _jwt.genrateToken(result.Data); //token generate
            result={Success:true,Token:token,Profile:result.Data};
        }
        response.json(result);
        response.end();
    }

    *Register(request,response){
        const data=request.body;
        const result= yield _adminService.Register(data);
        response.json(result);
        response.end();
    }


}

module.exports=AdminController;