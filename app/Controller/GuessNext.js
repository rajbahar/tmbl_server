'use strict';
const GuessNextService=require('../Service/GuessNextService');
const _GuessNextService=new GuessNextService();

class GuessNextController{
    constructor(){}

    *SelectGuessNext(request,response){
        const data=request.body;
        const result= yield _GuessNextService.SelectGuessNext(data);
        response.json(result);
        response.end();
    }

    *SubmitGuessNext(request,response){
        const data=request.body;
        const result= yield _GuessNextService.SubmitGuessNext(data);
        response.json(result);
        response.end();
    }

    *BroadcastGuessNext(request,response){
     
        const result= yield _GuessNextService.NextRound();
        response.io.emit("onGuessEvent");
        response.json({Success:true,Data:"onGuessEvent"});
        response.end();
    }
    
    *CurrentRound(request,response){
        const result= yield _GuessNextService.CurrentRound(data);
        response.json(result);
        response.end();
    }
    
}

module.exports=GuessNextController;
