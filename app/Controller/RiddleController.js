'use strict';
const RiddleService=require('../Service/RiddleService');
const _RiddleService=new RiddleService();

class RiddleController{
    constructor(){}

    *DeleteRiddle(request,response){
        const data=request.body;
        const result= yield _RiddleService.DeleteRiddle(data);
        response.json(result);
        response.end();
    }

    *UpdateRiddle(request,response){
        const data=request.body;
        const result= yield _RiddleService.UpdateRiddle(data);
        response.json(result);
        response.end();
    }

    *SubmitRiddle(request,response){
        const data=request.body;
        const result= yield _RiddleService.SubmitRiddle(data);
        response.json(result);
        response.end();
    }

    *FetchAllRiddle(request,response){
        const result= yield _RiddleService.FetchAllRiddle();
        response.json(result);
        response.end();
    }
    
    *FetchOneRiddle(request,response){
        const result= yield _RiddleService.FetchOneRiddle();
        response.json(result);
        response.end();
    }

    *ValidateRiddle(request,response){
        const data=request.body;
        const result= yield _RiddleService.ValidateRiddle(data);
        response.json(result);
        response.end();
    }
}

module.exports=RiddleController;
