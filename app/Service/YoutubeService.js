'use strict';

const YouTube=require('../Model/Youtube');

class YouTubeService{
    constructor(){}

    *Add(data){

        yield YouTube.deleteMany({});
        let result=new YouTube(data);
        yield result.save();

        return {Success:true,Data:result}

    }

    *List(){
        let result=yield YouTube.find();        
        return {Success:true,Data:result}
    }

 


}

module.exports=YouTubeService;