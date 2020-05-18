'use strict';
const JumbleService=require('../Service/JumbleService');
const _JumbleService=new JumbleService();

class JumbleController{
    constructor(){}

    *DeleteJumble(request,response){
        const data=request.body;
        const result= yield _JumbleService.DeleteJumble(data);
        response.json(result);
        response.end();
    }

    *UpdateJumble(request,response){
        const data=request.body;
        const result= yield _JumbleService.UpdateJumble(data);
        response.json(result);
        response.end();
    }

    *SubmitJumble(request,response){
        const data=request.body;
        const result= yield _JumbleService.SubmitJumble(data);
        response.json(result);
        response.end();
    }

    *FetchAllJumble(request,response){
        const result= yield _JumbleService.FetchAllJumble();
        response.json(result);
        response.end();
    }

    *FetchOneJumble(request,response){
        const data = request.body;
        const result= yield _JumbleService.FetchOneJumble(data);
        response.json(result);
        response.end();
    }

    *ValidateJumble(request,response){
        const data=request.body;
        const result= yield _JumbleService.ValidateJumble(data);
        response.json(result);
        response.end();
    }
}

module.exports=JumbleController;
