'use strict';
const LiveSocketService=require('../Service/LiveSocketService');

const _liveSocketService=new LiveSocketService();

class LiveSocketController{
    constructor(){

    }

    *Add(data){
        let result=yield _liveSocketService.Add(data);
        return result;
    }

    *List(){
        let result=yield _liveSocketService.List();
        return result;
    }

    *Delete(data){
        let result=yield _liveSocketService.Delete(data);
        return result;
    }

    *DeleteAll(){
        let result=yield _liveSocketService.DeleteAll();
        return result;
    }

}


module.exports=LiveSocketController;