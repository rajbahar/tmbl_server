'use strict'
const Zone=require('../Model/Zone');

class ZoneService{
    constructor(){}

    *create(data){
        const result=new Zone(data);
        yield result.save();

        return {Success:true,Data:result}
    }

    *getByName(data){
        let existing= yield Zone.findOne({Name:data.Name});
        if(!existing)return {Success:false,Data:"Zone name not found"}

        return {Success:true,Data:existing}
    }
    *getZoneList(){
        let list= yield Zone.find();
        return {Success:true,Data:list}
    }
}

module.exports=ZoneService;