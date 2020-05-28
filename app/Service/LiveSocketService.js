'use strict';

const LiveSocket=require('../Model/LiveSocket');

class LiveSocketService{
    constructor(){}

    *Add(data){

        let result=new LiveSocket(data);
        yield result.save();

        return {Success:true,Data:result}

    }

    *List(){
        let result=yield LiveSocket.find();        
        return {Success:true,Data:result}
    }

    *Delete(data){
        let result=yield LiveSocket.deleteOne({SocketID:data.id})        
        return {Success:true,Data:result}
    }

    *DeleteAll(){
        let result=yield LiveSocket.deleteMany({})        
        return {Success:true,Data:result}
    }

}

module.exports=LiveSocketService;