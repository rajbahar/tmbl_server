'use strict';
const CoinsService=require('../Service/CoinsService');
const _CoinsService=new CoinsService();

class CoinsController{
    constructor(){}

    *DeleteCoins(request,response){
        const data=request.body;
        const result= yield _CoinsService.DeleteCoins(data);
        response.json(result);
        response.end();
    }

    *UpdateCoins(request,response){
        const data=request.body;
        const result= yield _CoinsService.UpdateCoins(data);
        response.json(result);
        response.end();
    }

    *SubmitCoins(request,response){
        const data=request.body;
        const result= yield _CoinsService.SubmitCoins(data);
        response.json(result);
        response.end();
    }

    *FetchAllCoins(request,response){
        const result= yield _CoinsService.FetchAllCoins();
        response.json(result);
        response.end();
    }

}

module.exports=CoinsController;
