'use strict';
const TambolaService=require('../Service/TambolaService');
const _TambolaService = new TambolaService();

class TambolaController{
    constructor(){}

    *GenerateTicket(request,response){
        const data=request.body;
        const result= yield _TambolaService.GenerateTicket(data);
        response.json(result);
        response.end();
    }

    *ValidateTicket(request,response){
        const data=request.body;
        const result= yield _TambolaService.ValidateTicket(data);
        response.json(result);
        response.end();
    }

    *CreateNewSession(request,response){
        const result= yield _TambolaService.CreateNewSession();
        response.json(result);
        response.end();
    }

    *TambolaLive(request,response){
        const data=request.body;
        const result= yield _TambolaService.TambolaLive(data);
        if(result.Success)
            response.io.emit('onTambolaLive',data.Announced);
        response.json(result);
        response.end();
    }

    *TambolaAnnounced(request,response){
        const result= yield _TambolaService.TambolaAnnounced();
        response.json(result);
        response.end();
    }
}

module.exports=TambolaController;
