'use strict';
const TambolaService=require('../Service/TambolaService');
const CoinsService=require('../Service/CoinsService');
const _TambolaService = new TambolaService();
const _coinsService = new CoinsService();

class TambolaController{
    constructor(){}

    *GenerateTicket(request,response){
        const data=request.body;
        const result= yield _TambolaService.GenerateTicket(data);
        response.json(result);
        response.end();
    }

    *GetQuataDetails(request,response){
        let result=yield _coinsService.FetchAllCoins();
        response.json(result);
        response.end();
    }

    *ValidateTicket(request,response){
        const data=request.body;
        const result= yield _TambolaService.ValidateTicket(data);
        if(result.Success){
            let quota=yield _coinsService.FetchAllCoins();
            response.io.emit('onQuota',quota);
        }
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

    *TambolaSequenceCheck(request,response){
        const data=request.body;
        const result= yield _TambolaService.TambolaSequenceCheck(data);
        response.json(result);
        response.end();
    }

    *TSCAnyTwoPatttern(request,response){
        const data=request.body;
        const result= yield _TambolaService.TSCAnyTwoPatttern(data);
        response.json(result);
        response.end();
    }

    *TSCOneFullhousePatttern(request,response){
        const data=request.body;
        const result= yield _TambolaService.TSCOneFullhousePatttern(data);
        response.json(result);
        response.end();
    }
}

module.exports=TambolaController;
