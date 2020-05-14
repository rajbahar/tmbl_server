var express = require('express');
require("express-group-routes");
require('express-yields');
var router = express.Router();


//initialize controllers
const UserController=require('../app/Controller/UserController');


const _userController=new UserController();

function routes(app) {

  app.group("/api", router => {
    router.post("/login",_userController.Login);
    router.post("/register",_userController.Register);
    
  });

  app.group("/api/admin", router => {
    // router.use(function * (req, res,next) {
    //   yield jwt.verifyUserToken(req, res,next)
    
    // });
    router.get("/user/list",_userController.List);
  });
 
  return router;
}

module.exports = routes;
