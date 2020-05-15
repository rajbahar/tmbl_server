var express = require('express');
require("express-group-routes");
require('express-yields');
var router = express.Router();


//initialize controllers
const JWT=require('../app/JWT');
const UserController=require('../app/Controller/UserController');
const AdminController=require('../app/Controller/AdminController');
const QuizController=require('../app/Controller/QuizController');
const RiddleController=require('../app/Controller/RiddleController');
const JumbleController=require('../app/Controller/JumbleController');


const _jwt=new JWT();
const _userController=new UserController();
const _adminController=new AdminController();
const _quizController = new QuizController();
const _riddleController = new RiddleController();
const _jumbleController = new JumbleController();

function routes(app) {

  app.group("/api", router => {

    router.post("/login",_userController.Login);
    router.post("/register",_userController.Register);
    router.post("/verify/otp",_userController.OTP_verify);

    router.post("/admin/login",_adminController.Login);
    router.post("/admin/register",_adminController.Register);


  });

  
  app.group("/api", router => {

    router.use(function * (req, res,next) {
      yield _jwt.verifyUserToken(req, res,next)
    });

    router.get("/jumble/fetchOneJumble",_jumbleController.FetchOneJumble);
    router.post("/jumble/validateJumble",_jumbleController.ValidateJumble);
    router.get("/quiz/fetchOneQuiz",_quizController.FetchOneQuiz);
    router.post("/quiz/validateQuiz",_quizController.ValidateQuiz);
    router.get("/riddle/fetchOneRiddle",_riddleController.FetchOneRiddle);
    router.post("/riddle/validateRiddle",_riddleController.ValidateRiddle);

  });

  app.group("/api/admin", router => {
    router.use(function * (req, res,next) {
      yield _jwt.verifyUserToken(req, res,next)
    });
    router.get("/quiz/fetchAllQuiz",_quizController.FetchAllQuiz);
    router.post("/quiz/submitQuiz",_quizController.SubmitQuiz);
    router.post("/quiz/deleteQuiz",_quizController.DeleteQuiz);
    router.post("/quiz/updateQuiz",_quizController.UpdateQuiz);
    
    router.get("/riddle/fetchAllRiddle",_riddleController.FetchAllRiddle);
    router.post("/riddle/submitRiddle",_riddleController.SubmitRiddle);
    router.post("/riddle/deleteRiddle",_riddleController.DeleteRiddle);
    router.post("/riddle/updateRiddle",_riddleController.UpdateRiddle);

    router.get("/jumble/fetchAllJumble",_jumbleController.FetchAllJumble);
    router.post("/jumble/submitJumble",_jumbleController.SubmitJumble);
    router.post("/jumble/deleteJumble",_jumbleController.DeleteJumble);
    router.post("/jumble/updateJumble",_jumbleController.UpdateJumble);
    
    router.get("/user/list",_userController.List);

  });
 
  return router;
}

module.exports = routes;
