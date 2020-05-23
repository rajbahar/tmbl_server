'use strict'
const ZoneService=require('../Service/ZoneService');
const _zoneService=new ZoneService();

class ZoneController{
    constructor(){}

    *create(request,response){
        const data=request.body;
        const result=yield _zoneService.create(data);
        response.json(result);
        response.end();
    }

    *List(request,response){
        const result=yield _zoneService.getZoneList();
        response.json(result);
        response.end();
    }

}

module.exports=ZoneController;