'use strict'

const UserDetails=require('../Model/UserDetails');
const SessionDetails=require('../Model/Session');
const TambolaLiveDetails = require('../Model/TambolaLive');
var tambola = require('tambola-generator');
var arrayContainsAll = require('array-contains-all');
var diff = require("fast-array-diff");

class TambolaService{
    constructor(){}

    *GenerateTicket(data){
     
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let result=yield UserDetails.findOne({Phone:data.Phone,Session:sessionresult.Session}, {Phone:1,TambolaTicket:1,TambolaTicketNumber:1});
        var ticket = tambola.getTickets(1);       
        var NextTicketNo =1;
        var TambolaTicketNo =yield UserDetails.findOne({}, {TambolaTicketNumber:1}).sort([['TambolaTicketNumber', -1]]);
        console.log(NextTicketNo);
        console.log(TambolaTicketNo);
        if(TambolaTicketNo)
            NextTicketNo = TambolaTicketNo.TambolaTicketNumber + 1;
        console.log(NextTicketNo);
        if(!result)
        {
            console.log("phone not found");
            var DatatoUpload = {
                "Phone":data.Phone,
                "Session":sessionresult.Session,
                "Quiz": null,
                "Riddle":null,
                "GuessNext":null,
                "TambolaTicketNumber":NextTicketNo,
                "TambolaTicket":{
                    "first":ticket[0][0],
                    "second":ticket[0][1],
                    "third":ticket[0][2]
                }
            }
            let uploadresult = new UserDetails(DatatoUpload);
            yield uploadresult.save();
            result = {"Phone":data.Phone,
            "TambolaTicket":{
                "first":ticket[0][0],
                "second":ticket[0][1],
                "third":ticket[0][2]
                },
            "TambolaTicketNumber":NextTicketNo
            }
        }
        
        return {Success:true,Data:result}
    }

    *ValidateTicket(data){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let tambolaLiveData=yield TambolaLiveDetails.findOne({Session:sessionresult.Session});

        let result=yield UserDetails.findOne({Phone:data.Phone,Session:sessionresult.Session}, {Phone:1,TambolaTicket:1});
        var ticketAnnounced =[0];
        ticketAnnounced= ticketAnnounced.concat(tambolaLiveData.Announced);
        console.log(ticketAnnounced);
        if(!result){
            return {Success:false,Data:"Ticket not found"}
        }
        console.log(result.TambolaTicket);
        switch(data.Match){
            case "Early5": 
                    console.log("Early 5")
                    var a = diff.same(ticketAnnounced,result.TambolaTicket.first)
                    console.log(a)
                    a =a.concat(diff.same(ticketAnnounced,result.TambolaTicket.second))
                    a =a.concat(diff.same(ticketAnnounced,result.TambolaTicket.third))
                    console.log(a)
                    console.log(a.length-3)
                    if((a.length-3) >=5)
                    {
                        return {Success:true,Data:"Early 5 winner"}
                    }
                    else{
                        return {Success:false,Data:"Match Criteria fail"}
                    }
            case "Top":
                    console.log("Top Row")
                    
                    if(arrayContainsAll(ticketAnnounced,result.TambolaTicket.first))
                    {
                        return {Success:true,Data:"Top row winner"}
                    }
                    else{
                        return {Success:false,Data:"Match Criteria fail"}
                    }
            case "Middle":
                    console.log("Middle Row")
                    
                    
                    if(arrayContainsAll(ticketAnnounced,result.TambolaTicket.second))
                    {
                        return {Success:true,Data:"Middle row winner"}
                    }
                    else{
                        return {Success:false,Data:"Match Criteria fail"}
                    }                 
            case "Bottom":
                    console.log("Bottom Row")
                    var bottom = result.TambolaTicket.third;
                    
                    if(arrayContainsAll(ticketAnnounced,result.TambolaTicket.third))
                    {
                        return {Success:true,Data:"Bottom row winner"}
                    }
                    else{
                        return {Success:false,Data:"Match Criteria fail"}
                    }  
            case "Corners":
                    console.log("4 Corners")
                    var topleftcorner = 0;
                    var toprightcorner = 0;
                    var bottomleftcorner = 0;
                    var bottomrightcorner = 0;
                    result.TambolaTicket.first.forEach(element => {
                        if(element!= 0)
                        {
                            if(topleftcorner == 0)
                                topleftcorner = element;
                            toprightcorner = element;
                        }                        
                    });

                    result.TambolaTicket.third.forEach(element => {
                        if(element!= 0)
                        {
                            if(bottomleftcorner == 0)
                                bottomleftcorner = element;
                            bottomrightcorner = element;
                        }                        
                    });

                    var cornerArray = [topleftcorner,toprightcorner,bottomleftcorner,bottomrightcorner]
                    console.log(cornerArray);
                    if(arrayContainsAll(ticketAnnounced,cornerArray))
                        return {Success:true,Data:"4 corners winner"}
                    else
                        return {Success:false,Data:"Match Criteria fail"}                      
            case "Cross":
                            console.log("Cross")
                            var topleftcorner = 0;
                            var toprightcorner = 0;
                            var bottomleftcorner = 0;
                            var bottomrightcorner = 0;
                            var centre = 0;
                            result.TambolaTicket.first.forEach(element => {
                                if(element!= 0)
                                {
                                    if(topleftcorner == 0)
                                        topleftcorner = element;
                                    toprightcorner = element;
                                }                        
                            });
                            var i =0;
                            result.TambolaTicket.second.forEach(element => {
                                if(element!= 0)
                                {
                                    i++;
                                    if(i==3)
                                        centre = element;
                                }                        
                            });
        
                            result.TambolaTicket.third.forEach(element => {
                                if(element!= 0)
                                {
                                    if(bottomleftcorner == 0)
                                        bottomleftcorner = element;
                                    bottomrightcorner = element;
                                }                        
                            });
        
                            var crossArray = [topleftcorner,toprightcorner,centre,bottomleftcorner,bottomrightcorner]
                            console.log(crossArray);
                            if(arrayContainsAll(ticketAnnounced,crossArray))
                                return {Success:true,Data:"cross winner"}
                            else
                                return {Success:false,Data:"Match Criteria fail"}                      
            case "FullHouse":
                    console.log("Full Housie")
                    if(arrayContainsAll(ticketAnnounced,result.TambolaTicket.first) && 
                        arrayContainsAll(ticketAnnounced,result.TambolaTicket.second) &&
                        arrayContainsAll(ticketAnnounced,result.TambolaTicket.third))
                    {
                        return {Success:true,Data:"Full House winner"}
                    }
                    else{
                        return {Success:false,Data:"Match Criteria fail"}  
                    }
            default:
                console.log("No match");
                return {Success:false,Data:"Ticket found but match criteria not valid"}
        }
        return {Success:true,Data:"Ticket found"}

    }

    *CreateNewSession(){
        let result=yield SessionDetails.findOne({}).sort([['Session', -1]])
        if(!result)
        {
            var sessionData={
                "Session":1
            }
            let uploadsession = new SessionDetails(sessionData);
            yield uploadsession.save();
            result = sessionData;
        }
        else{
            console.log("new session req");
            var sessionData={
                "Session":(result.Session + 1)
            }
            let uploadsession = new SessionDetails(sessionData);
            yield uploadsession.save();
            result = sessionData;
        }

        return {Success:true,Data:result}

    }
    
    *TambolaLive(data){
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let result=yield TambolaLiveDetails.findOne({Session:sessionresult.Session});
        if(!result)
        {
            var tambolaLiveData={
                "Session":sessionresult.Session,
                "Announced":[data.Announced]
            }
            let uploadTambolaAnnounced = new TambolaLiveDetails(tambolaLiveData);
            yield uploadTambolaAnnounced.save();
            result = tambolaLiveData;
        }
        else{
            console.log("new session req");
            var TotalAnnounced= result.Announced;
            if(arrayContainsAll(TotalAnnounced,[data.Announced]))
            {
                console.log("repeated number");
                return {Success:false,Data:"Repeated number"}        
            }
            else
            {   
                console.log("no");
                TotalAnnounced.push(data.Announced);
                yield TambolaLiveDetails.findOneAndUpdate({
                    Session:sessionresult.Session
                    },{ $set: { Announced: TotalAnnounced } });
                console.log(TotalAnnounced);
            }
        }

        return {Success:true,Data:result}

    }    
}

module.exports=TambolaService;