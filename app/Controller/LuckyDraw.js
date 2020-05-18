'use strict';
const LuckyDrawService=require('../Service/LuckyDraw');
const _LuckyDrawService=new LuckyDrawService();

class LuckyDrawController{
    constructor(){}

    *OptLuckyDraw(request,response){
        const data=request.body;
        const result= yield _LuckyDrawService.OptLuckyDraw(data);
        response.json(result);
        response.end();
    }

    *SelectLuckyDraw(request,response){
        const data=request.body;
        const result= yield _LuckyDrawService.SelectLuckyDraw(data);
        response.json(result);
        response.end();
    }

    *FetchOptedLuckyDraw(request,response){
        const result= yield _LuckyDrawService.FetchOptedLuckyDraw();
        response.json(result);
        response.end();
    }

    *FetchWinners(request,response){
        const result= yield _LuckyDrawService.FetchWinners();
        response.json(result);
        response.end();
    }

    
}

module.exports=LuckyDrawController;
