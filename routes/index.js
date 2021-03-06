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
const TambolaController=require('../app/Controller/TambolaController');
const LuckyDrawController=require('../app/Controller/LuckyDraw');
const GuessNextController=require('../app/Controller/GuessNext');
const CoinsController=require('../app/Controller/CoinsController');
const ZoneController=require('../app/Controller/ZoneController');


const _jwt=new JWT();
const _userController=new UserController();
const _adminController=new AdminController();
const _quizController = new QuizController();
const _riddleController = new RiddleController();
const _jumbleController = new JumbleController();
const _tambolaController = new TambolaController();
const _luckydrawController = new LuckyDrawController();
const _guessnextController = new GuessNextController();
const _coinsController = new CoinsController();
const _zoneController = new ZoneController();

function routes(app) {

  app.group("/api", router => {

    router.post("/login",_userController.Login);
    router.post("/register",_userController.Register);
    router.post("/register/simulate",_userController.RegisterSimuLate);
    router.post("/verify/otp",_userController.OTP_verify);

    router.post("/admin/login",_adminController.Login);
    router.post("/admin/register",_adminController.Register);

    router.get('/profile',_userController.GetProfile);

    router.get("/users/list",_userController.List);

    router.get('/user/delete',_userController.DeleteUser);
    
  });

  
  app.group("/api", router => {

    router.use(function * (req, res,next) {
      yield _jwt.verifyUserToken(req, res,next)
    });

    router.get('/user/profile',_userController.GetProfile);
    router.get('/user/setReminder',_userController.SetReminder);
    router.get('/user/total/earning',_userController.GetEarning);
    router.get('/user/coins/details',_userController.GetCoinsDetails);
    router.get('/get/quota/details',_tambolaController.GetQuataDetails);
    router.get('/getreferrals/link',_userController.GetReferralLink);
    router.post("/jumble/fetchonejumble",_jumbleController.FetchOneJumble);
    router.post("/jumble/validatejumble",_jumbleController.ValidateJumble);
    router.post("/quiz/fetchonequiz",_quizController.FetchOneQuiz);
    router.post("/quiz/validatequiz",_quizController.ValidateQuiz);
    router.post("/riddle/fetchoneriddle",_riddleController.FetchOneRiddle);
    router.post("/riddle/validateriddle",_riddleController.ValidateRiddle);
    router.post("/tambola/generateticket",_tambolaController.GenerateTicket);
    router.post("/tambola/validateticket",_tambolaController.ValidateTicket);
    router.get("/tambola/tambolaannounced",_tambolaController.TambolaAnnounced);
    router.post("/lucky/optluckydraw",_luckydrawController.OptLuckyDraw);
    router.post("/guess/selectnumber",_guessnextController.SelectGuessNext);
    router.get("/youtube/link",_adminController.YoutubeLink);


  });

  app.group("/api/admin", router => {
    router.use(function * (req, res,next) {
      yield _jwt.verifyUserToken(req, res,next)
    });
    router.get("/quiz/fetchallquiz",_quizController.FetchAllQuiz);
    router.post("/quiz/submitquiz",_quizController.SubmitQuiz);
    router.post("/quiz/deletequiz",_quizController.DeleteQuiz);
    router.post("/quiz/updatequiz",_quizController.UpdateQuiz);
    
    router.get("/riddle/fetchallriddle",_riddleController.FetchAllRiddle);
    router.post("/riddle/submitriddle",_riddleController.SubmitRiddle);
    router.post("/riddle/deleteriddle",_riddleController.DeleteRiddle);
    router.post("/riddle/updateriddle",_riddleController.UpdateRiddle);

    router.get("/jumble/fetchalljumble",_jumbleController.FetchAllJumble);
    router.post("/jumble/submitjumble",_jumbleController.SubmitJumble);
    router.post("/jumble/deletejumble",_jumbleController.DeleteJumble);
    router.post("/jumble/updatejumble",_jumbleController.UpdateJumble);
    
    router.post("/session/newsession",_tambolaController.CreateNewSession);
    router.post("/tambola/tambolalive",_tambolaController.TambolaLive);
    router.post("/tambola/tambolasequencecheck",_tambolaController.TambolaSequenceCheck);
    router.post("/tambola/tambolaanytwo",_tambolaController.TSCAnyTwoPatttern);
    router.post("/tambola/tsconefullhouse",_tambolaController.TSCOneFullhousePatttern);
    
    router.get("/lucky/fetchoptedluckydraw",_luckydrawController.FetchOptedLuckyDraw);
    router.get("/lucky/fetchwinners",_luckydrawController.FetchWinners);
    
    router.post("/guess/submitnextnumber",_guessnextController.SubmitGuessNext);
    router.post("/guess/currentround",_guessnextController.CurrentRound);

    
    router.post("/coins/deletecoins",_coinsController.DeleteCoins);
    router.post("/coins/updatecoins",_coinsController.UpdateCoins);
    router.post("/coins/submitcoins",_coinsController.SubmitCoins);
    router.get("/coins/fetchallcoins",_coinsController.FetchAllCoins);

    router.post("/zone/create",_zoneController.create);
    router.get("/zone/list",_zoneController.List);

    router.post("/broadcast/quiz",_quizController.BroadcastQuiz)
    router.post("/broadcast/guess",_guessnextController.BroadcastGuessNext)
    router.get("/user/list",_userController.List);

    router.get("/user/sendReminder",_userController.sendReminderSMS);

    router.post("/youtube/link/add",_adminController.AddLink);

  });
 
  return router;
}

module.exports = routes;
