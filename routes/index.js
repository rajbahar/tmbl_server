var express = require('express');
require("express-group-routes");
require('express-yields');
var router = express.Router();

function routes(app) {

  app.group("/api", router => {
    // router.post("/login",_userController.Login);
    // router.post("/register",_userController.Register);
    
  });

  // app.group("/api", router => {
  //   router.use(function * (req, res,next) {
  //     yield jwt.verifyUserToken(req, res,next)
    
  //   });
    
  // });
 
  return router;
}

module.exports = routes;
