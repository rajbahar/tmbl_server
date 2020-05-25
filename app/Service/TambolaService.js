'use strict'

const Coins = require('../Model/Coins');
const UserDetails = require('../Model/UserDetails');
const User = require('../Model/User');
const SessionDetails = require('../Model/Session');
const TambolaLiveDetails = require('../Model/TambolaLive');
var tambola = require('tambola-generator');
var arrayContainsAll = require('array-contains-all');
var arrayDiff = require('simple-array-diff');

class TambolaService {
    constructor() { }

    *GenerateTicket(data) {
        let userresult = yield User.findOne({ Phone: data.Phone });
        if (!userresult)
            return { Success: false, Data: "User not present" }
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])
        let result = yield UserDetails.findOne({ Phone: data.Phone, Session: sessionresult.Session });

        var NextTicketNo = 1;
        var TambolaTicketNo = yield UserDetails.findOne({}, { TambolaTicketNumber: 1 }).sort([['TambolaTicketNumber', -1]]);
        console.log(NextTicketNo);
        console.log(TambolaTicketNo);
        if (TambolaTicketNo)
            NextTicketNo = TambolaTicketNo.TambolaTicketNumber + 1;
        console.log(NextTicketNo);
        if (!result) {
            var ticket = tambola.getTickets(1);
            console.log("phone not found");
            console.log(ticket);
            var DatatoUpload = {
                "Phone": data.Phone,
                "Session": sessionresult.Session,
                "Quiz": null,
                "GuessNext": null,
                "TambolaTicketNumber": NextTicketNo,
                "TambolaTicket": {
                    "first": ticket[0][0],
                    "second": ticket[0][1],
                    "third": ticket[0][2]
                },
                "LuckyDraw": { "opt": false, "win": false },
                "TambolaWin": { "top": false, "middle": false, "last": false, "corners": false, "fastfive": false, "housie": false }
            }
            let uploadresult = new UserDetails(DatatoUpload);
            yield uploadresult.save();
            result = DatatoUpload;

            let existingUser = yield User.findOne({
                Phone: data.Phone
            });
            let c= yield Coins.findOne({ Game: 'SignUp'});
            if(c){
                existingUser.coins= (existingUser.coins+c.Coins);

                let SignUpFound=false;
                for (let index = 0; index < existingUser.AllCoins.length; index++) {
                    const element = existingUser.AllCoins[index];
                    if (element.Game == 'SignUp') {
                        SignUpFound=true;
                        existingUser.AllCoins[index].Coin = existingUser.AllCoins[index].Coin + c.Coins;
                    }
                }
                if(SignUpFound==false){
                    existingUser.AllCoins.push({ Game: 'SignUp', Coin: c.Coins });
                }
            }
            yield existingUser.save();

        }

        // add signup coin pedding
        return { Success: true, Data: result }
    }

    *ValidateTicket(data) {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])
        let tambolaLiveData = yield TambolaLiveDetails.findOne({ Session: sessionresult.Session });

        let result = yield UserDetails.findOne({ Phone: data.Phone, Session: sessionresult.Session }, { Phone: 1, TambolaTicket: 1, TambolaWin: 1 });
        var ticketAnnounced = [0];
        ticketAnnounced = ticketAnnounced.concat(tambolaLiveData.Announced);
        console.log(ticketAnnounced);
        if (!result) {
            return { Success: false, Data: "Ticket not found" }
        }
        console.log(result.TambolaTicket);
        let c = null;
        switch (data.Match) {
            case "Early5":
                console.log("Early 5")

                if (result.TambolaWin.fastfive) return { Success: false, Data: 'User already claimed' }

                c = yield Coins.findOne({ Game: 'JaldiFive' });
                if (c.Quota < 1) {
                    return { Success: false, Data: 'Quota Finished' }
                }

                var arrayDifference = arrayDiff(
                    result.TambolaTicket.first, ticketAnnounced
                );
                var a = arrayDifference.common;
                arrayDifference = arrayDiff(
                    result.TambolaTicket.second, ticketAnnounced
                );
                a = a.concat(arrayDifference.common);
                arrayDifference = arrayDiff(
                    result.TambolaTicket.third, ticketAnnounced
                );
                a = a.concat(arrayDifference.common);
                console.log(a)
                console.log(a.length - 3)

                if ((a.length - 3) >= 5) {
                    result.TambolaWin.fastfive = true;
                    yield UserDetails.findOneAndUpdate({ Phone: data.Phone, Session: sessionresult.Session },
                        {
                            $set: { TambolaWin: result.TambolaWin }
                        });

                    //add jaldi coins 
                    let existingUser = yield User.findOne({
                        Phone: data.Phone
                    });

                    if (c) {
                        existingUser.coins = (existingUser.coins + c.Coins);
                        c.Quota = c.Quota - 1;
                        yield c.save();

                        let FastFiveFound = false;
                        for (let index = 0; index < existingUser.AllCoins.length; index++) {
                            const element = existingUser.AllCoins[index];
                            if (element.Game == 'FastFive') {
                                FastFiveFound = true;
                                existingUser.AllCoins[index].Coin = existingUser.AllCoins[index].Coin + c.Coins;
                            }
                        }
                        if (FastFiveFound == false) {
                            existingUser.AllCoins.push({ Game: 'FastFive', Coin: c.Coins });
                        }
                    }
                    yield existingUser.save();
                    yield result.save();

                    return { Success: true, Data: "AWESOME! YOU HAVE WON JALDI 5" }
                }
                else {
                    return { Success: false, Data: "Match Criteria fail" }
                }
            case "Top":
                console.log("Top Row")
                if (result.TambolaWin.top) return { Success: false, Data: 'User already claimed' }
                c = yield Coins.findOne({ Game: 'TopRow' });
                if (c.Quota < 1) {
                    return { Success: false, Data: 'Quota Finished' }
                }

                if (arrayContainsAll(ticketAnnounced, result.TambolaTicket.first)) {
                    result.TambolaWin.top = true;
                    yield UserDetails.findOneAndUpdate({ Phone: data.Phone, Session: sessionresult.Session },
                        {
                            $set: { TambolaWin: result.TambolaWin }
                        });

                    //add top coins 
                    let existingUser = yield User.findOne({
                        Phone: data.Phone
                    });

                    if (c) {

                        existingUser.coins = (existingUser.coins + c.Coins)
                        c.Quota = c.Quota - 1;
                        yield c.save();
                        let TopFound = false;
                        for (let index = 0; index < existingUser.AllCoins.length; index++) {
                            const element = existingUser.AllCoins[index];
                            if (element.Game == 'TopRow') {
                                TopFound = true;
                                existingUser.AllCoins[index].Coin = existingUser.AllCoins[index].Coin + c.Coins;
                            }
                        }
                        if (TopFound == false) {
                            existingUser.AllCoins.push({ Game: 'TopRow', Coin: c.Coins });
                        }
                    }
                    yield existingUser.save();

                    yield result.save();
                    return { Success: true, Data: "AWESOME! YOU HAVE WON TOP ROW" }
                }
                else {
                    return { Success: false, Data: "Match Criteria fail" }
                }
            case "Middle":
                console.log("Middle Row")
                if (result.TambolaWin.middle) return { Success: false, Data: 'User already claimed' }
                c = yield Coins.findOne({ Game: 'MiddleRow' });
                if (c.Quota < 1) {
                    return { Success: false, Data: 'Quota Finished' }
                }

                if (arrayContainsAll(ticketAnnounced, result.TambolaTicket.second)) {
                    result.TambolaWin.middle = true;
                    yield UserDetails.findOneAndUpdate({ Phone: data.Phone, Session: sessionresult.Session },
                        {
                            $set: { TambolaWin: result.TambolaWin }
                        });

                    //add middle coins
                    let existingUser = yield User.findOne({
                        Phone: data.Phone
                    });

                    if (c) {

                        existingUser.coins = (existingUser.coins + c.Coins)
                        c.Quota = c.Quota - 1;
                        yield c.save();

                        let MiddleFound = false;
                        for (let index = 0; index < existingUser.AllCoins.length; index++) {
                            const element = existingUser.AllCoins[index];
                            if (element.Game == 'MiddleRow') {
                                MiddleFound = true;
                                existingUser.AllCoins[index].Coin = existingUser.AllCoins[index].Coin + c.Coins;
                            }
                        }
                        if (MiddleFound == false) {
                            existingUser.AllCoins.push({ Game: 'MiddleRow', Coin: c.Coins });
                        }

                    }
                    yield existingUser.save();
                    yield result.save();

                    return { Success: true, Data: "AWESOME! YOU HAVE WON MIDDLE ROW" }
                }
                else {
                    return { Success: false, Data: "Match Criteria fail" }
                }
            case "Bottom":
                console.log("Bottom Row")
                if (result.TambolaWin.bottom) return { Success: false, Data: 'User already claimed' }
                c = yield Coins.findOne({ Game: 'BottomRow' });
                if (c.Quota < 1) {
                    return { Success: false, Data: 'Quota Finished' }
                }

                var bottom = result.TambolaTicket.third;

                if (arrayContainsAll(ticketAnnounced, result.TambolaTicket.third)) {
                    result.TambolaWin.bottom = true;
                    yield UserDetails.findOneAndUpdate({ Phone: data.Phone, Session: sessionresult.Session },
                        {
                            $set: { TambolaWin: result.TambolaWin }
                        });

                    //add bottom coins 
                    let existingUser = yield User.findOne({
                        Phone: data.Phone
                    });

                    if (c) {

                        existingUser.coins = (existingUser.coins + c.Coins)
                        c.Quota = c.Quota - 1;
                        yield c.save();

                        let LastFound = false;
                        for (let index = 0; index < existingUser.AllCoins.length; index++) {
                            const element = existingUser.AllCoins[index];
                            if (element.Game == 'LastRow') {
                                LastFound = true;
                                existingUser.AllCoins[index].Coin = existingUser.AllCoins[index].Coin + c.Coins;
                            }
                        }
                        if (LastFound == false) {
                            existingUser.AllCoins.push({ Game: 'LastRow', Coin: c.Coins });
                        }

                    }
                    yield existingUser.save();
                    yield result.save();

                    return { Success: true, Data: "AWESOME! YOU HAVE WON BOTTOM ROW" }
                }
                else {
                    return { Success: false, Data: "Match Criteria fail" }
                }
            case "Corners":
                console.log("4 Corners")

                if (result.TambolaWin.corners) return { Success: false, Data: 'User already claimed' }

                c = yield Coins.findOne({ Game: 'Corners' });
                if (c.Quota < 1) {
                    return { Success: false, Data: 'Quota Finished' }
                }

                var topleftcorner = 0;
                var toprightcorner = 0;
                var bottomleftcorner = 0;
                var bottomrightcorner = 0;
                result.TambolaTicket.first.forEach(element => {
                    if (element != 0) {
                        if (topleftcorner == 0)
                            topleftcorner = element;
                        toprightcorner = element;
                    }
                });

                result.TambolaTicket.third.forEach(element => {
                    if (element != 0) {
                        if (bottomleftcorner == 0)
                            bottomleftcorner = element;
                        bottomrightcorner = element;
                    }

                });
                var cornerArray = [topleftcorner, toprightcorner, bottomleftcorner, bottomrightcorner]
                console.log(cornerArray);
                if (arrayContainsAll(ticketAnnounced, cornerArray)) {
                    result.TambolaWin.corners = true;
                    yield UserDetails.findOneAndUpdate({ Phone: data.Phone, Session: sessionresult.Session },
                        {
                            $set: { TambolaWin: result.TambolaWin }
                        });

                    // add corners coins 
                    let existingUser = yield User.findOne({
                        Phone: data.Phone
                    });

                    if (c) {

                        existingUser.coins = (existingUser.coins + c.Coins)
                        c.Quota = c.Quota - 1;
                        yield c.save();

                        let CornerFound = false;
                        for (let index = 0; index < existingUser.AllCoins.length; index++) {
                            const element = existingUser.AllCoins[index];
                            if (element.Game == 'Corners') {
                                CornerFound = true;
                                existingUser.AllCoins[index].Coin = existingUser.AllCoins[index].Coin + c.Coins;
                            }
                        }
                        if (CornerFound == false) {
                            existingUser.AllCoins.push({ Game: 'Corners', Coin: c.Coins });
                        }

                    }
                    yield existingUser.save();
                    yield result.save();

                    return { Success: true, Data: "AWESOME! YOU HAVE WON 4 CORNERS" }
                }
                else
                    return { Success: false, Data: "Match Criteria fail" }
            // case "Cross":
            //                 console.log("Cross")
            //                 var topleftcorner = 0;
            //                 var toprightcorner = 0;
            //                 var bottomleftcorner = 0;
            //                 var bottomrightcorner = 0;
            //                 var centre = 0;
            //                 result.TambolaTicket.first.forEach(element => {
            //                     if(element!= 0)
            //                     {
            //                         if(topleftcorner == 0)
            //                             topleftcorner = element;
            //                         toprightcorner = element;
            //                     }                        
            //                 });
            //                 var i =0;
            //                 result.TambolaTicket.second.forEach(element => {
            //                     if(element!= 0)
            //                     {
            //                         i++;
            //                         if(i==3)
            //                             centre = element;
            //                     }                        
            //                 });

            //                 result.TambolaTicket.third.forEach(element => {
            //                     if(element!= 0)
            //                     {
            //                         if(bottomleftcorner == 0)
            //                             bottomleftcorner = element;
            //                         bottomrightcorner = element;
            //                     }                        
            //                 });

            //                 var crossArray = [topleftcorner,toprightcorner,centre,bottomleftcorner,bottomrightcorner]
            //                 console.log(crossArray);
            //                if(arrayContainsAll(ticketAnnounced,crossArray))
            //                     return {Success:true,Data:"cross winner"}
            //                 else
            //                     return {Success:false,Data:"Match Criteria fail"}                      
            case "FullHouse":
                console.log("Full Housie")
                if (result.TambolaWin.housie) return { Success: false, Data: 'User already claimed' }

                c = yield Coins.findOne({ Game: 'FullHousie' });
                if (c.Quota < 1) {
                    return { Success: false, Data: 'Quota Finished' }
                }

                if (arrayContainsAll(ticketAnnounced, result.TambolaTicket.first) &&
                    arrayContainsAll(ticketAnnounced, result.TambolaTicket.second) &&
                    arrayContainsAll(ticketAnnounced, result.TambolaTicket.third)) {
                    result.TambolaWin.housie = true;
                    yield UserDetails.findOneAndUpdate({ Phone: data.Phone, Session: sessionresult.Session },
                        {
                            $set: { TambolaWin: result.TambolaWin }
                        });

                    // add housie coins 
                    let existingUser = yield User.findOne({
                        Phone: data.Phone
                    });

                    if (c) {

                        existingUser.coins = (existingUser.coins + c.Coins)
                        c.Quota = c.Quota - 1;
                        yield c.save();

                        let FullHouseFound = false;
                        for (let index = 0; index < existingUser.AllCoins.length; index++) {
                            const element = existingUser.AllCoins[index];
                            if (element.Game == 'FullHouse') {
                                FullHouseFound = true;
                                existingUser.AllCoins[index].Coin = existingUser.AllCoins[index].Coin + c.Coins;
                            }
                        }
                        if (FullHouseFound == false) {
                            existingUser.AllCoins.push({ Game: 'FullHouse', Coin: c.Coins });
                        }

                    }
                    yield existingUser.save();
                    yield result.save();

                    return { Success: true, Data: "AWESOME! YOU HAVE WON FULL HOUSIE" }
                }
                else {
                    return { Success: false, Data: "Match Criteria fail" }
                }
            default:
                console.log("No match");
                return { Success: false, Data: "Ticket found but match criteria not valid" }
        }
    }

    *CreateNewSession() {
        let result = yield SessionDetails.findOne({}).sort([['Session', -1]])
        if (!result) {
            var sessionData = {
                "Session": 1
            }
            let uploadsession = new SessionDetails(sessionData);
            yield uploadsession.save();
            result = sessionData;
        }
        else {
            console.log("new session req");
            var sessionData = {
                "Session": (result.Session + 1)
            }
            let uploadsession = new SessionDetails(sessionData);
            yield uploadsession.save();
            result = sessionData;
        }

        return { Success: true, Data: result }

    }

    *TambolaLive(data) {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])
        let result = yield TambolaLiveDetails.findOne({ Session: sessionresult.Session });
        if (!result) {
            var tambolaLiveData = {
                "Session": sessionresult.Session,
                "Announced": [data.Announced]
            }
            let uploadTambolaAnnounced = new TambolaLiveDetails(tambolaLiveData);
            yield uploadTambolaAnnounced.save();
            result = tambolaLiveData;
        }
        else {
            console.log("new session req");
            var TotalAnnounced = result.Announced;
            if (arrayContainsAll(TotalAnnounced, [data.Announced])) {
                console.log("repeated number");
                return { Success: false, Data: "Repeated number" }
            }
            else {
                console.log("no");
                TotalAnnounced.push(data.Announced);
                yield TambolaLiveDetails.findOneAndUpdate({
                    Session: sessionresult.Session
                }, { $set: { Announced: TotalAnnounced } });
                console.log(TotalAnnounced);
            }
        }

        return { Success: true, Data: result }

    }

    *TambolaAnnounced() {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])
        let result = yield TambolaLiveDetails.findOne({ Session: sessionresult.Session });
        return { Success: true, Data: result }
    }

    *TambolaSequenceCheck(Data) {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]]);
        let result = yield UserDetails.find({ Session: sessionresult.Session }, { TambolaTicketNumber: 1, TambolaTicket: 1 });
        var ticketArray = [];
        var dataToSend = {
            fullhouse: [],
            toprow: [],
            middlerow: [],
            lastrow: [],
            jaldi5: [],
            corners: [],
            luckydraw: [],
            count: { fullhouse: Number, toprow: Number, middlerow: Number, lastrow: Number, jaldi5: Number, corners: Number, luckydraw: Number }
        }

        result.forEach(element => {

            let checker = (arr, target) => target.every(v => arr.includes(v));

            var fullhouse = [];
            var fourcorners = [];
            var lastrow = [];
            var toprow = [];
            var middlerow = [];

            var firstcorner = 0;
            var lastcorner = 0;

            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.third[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    lastrow.push(currentvalue);
                    if (lastcorner <= 0)
                        lastcorner = currentvalue;
                    firstcorner = currentvalue;
                    fullhouse.push(currentvalue);
                }
            }
            fourcorners.push(firstcorner);
            fourcorners.push(lastcorner);

            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.second[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    middlerow.push(currentvalue);
                    fullhouse.push(currentvalue);
                }
            }

            firstcorner = 0;
            lastcorner = 0;
            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.first[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    toprow.push(currentvalue);
                    if (lastcorner <= 0)
                        lastcorner = currentvalue;
                    firstcorner = currentvalue;
                    fullhouse.push(currentvalue);
                }
            }
            fourcorners.push(firstcorner);
            fourcorners.push(lastcorner);

            var Nomatch = true;

            const intersection = fullhouse.filter(element => Data.Announced.includes(element));
            if (intersection.length >= 5) {
                //change div to show class
                Nomatch = false;
                dataToSend.jaldi5.push(element.TambolaTicketNumber);
            }

            if (checker(Data.Announced, toprow)) {
                Nomatch = false;
                dataToSend.toprow.push(element.TambolaTicketNumber);
            }
            if (checker(Data.Announced, middlerow)) {
                Nomatch = false;
                dataToSend.middlerow.push(element.TambolaTicketNumber);
            }
            if (checker(Data.Announced, lastrow)) {
                Nomatch = false;
                dataToSend.lastrow.push(element.TambolaTicketNumber);
            }
            if (checker(Data.Announced, fourcorners)) {
                Nomatch = false;
                dataToSend.corners.push(element.TambolaTicketNumber);
            }
            if (checker(Data.Announced, fullhouse)) {
                Nomatch = false;
                dataToSend.fullhouse.push(element.TambolaTicketNumber);
            }

            if (Nomatch)
                dataToSend.luckydraw.push(element.TambolaTicketNumber);

        });

        dataToSend.count.fullhouse = dataToSend.fullhouse.length;
        dataToSend.count.toprow = dataToSend.toprow.length;
        dataToSend.count.middlerow = dataToSend.middlerow.length;
        dataToSend.count.lastrow = dataToSend.lastrow.length;
        dataToSend.count.jaldi5 = dataToSend.jaldi5.length;
        dataToSend.count.corners = dataToSend.corners.length;
        dataToSend.count.luckydraw = dataToSend.luckydraw.length;
        dataToSend.ticketArray = ticketArray;
        return { Success: true, Data: dataToSend }
    }

    *TSCAnyTwoPatttern(Data) {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]]);
        let result = yield UserDetails.find({ Session: sessionresult.Session }, { TambolaTicketNumber: 1, TambolaTicket: 1 });
        var ticketArray = [];
        var dataToSend = {
            fullhouse: [],
            toprow: [],
            middlerow: [],
            lastrow: [],
            jaldi5: [],
            corners: [],
            luckydraw: [],
            count: { fullhouse: Number, toprow: Number, middlerow: Number, lastrow: Number, jaldi5: Number, corners: Number, luckydraw: Number }
        }

        var c = null;
        var fullhouseQ = 0;
        var toprowQ = 0;
        var middlerowQ = 0;
        var lastrowQ = 0;
        var jaldi5rowQ = 0;
        var cornersrowQ = 0;

        if (Data.Quota) {
            c = yield Coins.findOne({ Game: 'FullHousie' });
            fullhouseQ = c.Quota;
            c = yield Coins.findOne({ Game: 'TopRow' });
            toprowQ = c.Quota;
            c = yield Coins.findOne({ Game: 'MiddleRow' });
            middlerowQ = c.Quota;
            c = yield Coins.findOne({ Game: 'BottomRow' });
            lastrowQ = c.Quota;
            c = yield Coins.findOne({ Game: 'JaldiFive' });
            jaldi5rowQ = c.Quota;
            c = yield Coins.findOne({ Game: 'Corners' });
            cornersrowQ = c.Quota;
        }

        console.log(fullhouseQ);
        console.log(toprowQ);
        console.log(middlerowQ);
        console.log(lastrowQ);
        console.log(jaldi5rowQ);
        console.log(cornersrowQ);


        result.forEach(element => {

            let checker = (arr, target) => target.every(v => arr.includes(v));

            var fullhouse = [];
            var fourcorners = [];
            var lastrow = [];
            var toprow = [];
            var middlerow = [];

            var firstcorner = 0;
            var lastcorner = 0;

            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.third[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    lastrow.push(currentvalue);
                    if (lastcorner <= 0)
                        lastcorner = currentvalue;
                    firstcorner = currentvalue;
                    fullhouse.push(currentvalue);
                }
            }
            fourcorners.push(firstcorner);
            fourcorners.push(lastcorner);

            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.second[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    middlerow.push(currentvalue);
                    fullhouse.push(currentvalue);
                }
            }

            firstcorner = 0;
            lastcorner = 0;
            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.first[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    toprow.push(currentvalue);
                    if (lastcorner <= 0)
                        lastcorner = currentvalue;
                    firstcorner = currentvalue;
                    fullhouse.push(currentvalue);
                }
            }
            fourcorners.push(firstcorner);
            fourcorners.push(lastcorner);


            var Nomatch = true;
            var claimed = 0;

            if (Data.Quota) {
                const intersection = fullhouse.filter(element => Data.Announced.includes(element));
                if (intersection.length >= 5 && jaldi5rowQ > 0 && claimed < 2) {
                    //change div to show class
                    Nomatch = false;
                    dataToSend.jaldi5.push(element.TambolaTicketNumber);
                    jaldi5rowQ--;
                    claimed++;
                }

                if (checker(Data.Announced, toprow) && toprowQ > 0 && claimed < 2) {
                    Nomatch = false;
                    dataToSend.toprow.push(element.TambolaTicketNumber);
                    toprowQ--;
                    claimed++;
                }
                if (checker(Data.Announced, middlerow) && middlerowQ > 0 && claimed < 2) {
                    Nomatch = false;
                    dataToSend.middlerow.push(element.TambolaTicketNumber);
                    middlerowQ--;
                    claimed++;
                }
                if (checker(Data.Announced, lastrow) && lastrowQ > 0 && claimed < 2) {
                    Nomatch = false;
                    dataToSend.lastrow.push(element.TambolaTicketNumber);
                    lastrowQ--;
                    claimed++;
                }
                if (checker(Data.Announced, fourcorners) && cornersrowQ > 0 && claimed < 2) {
                    Nomatch = false;
                    dataToSend.corners.push(element.TambolaTicketNumber);
                    cornersrowQ--;
                    claimed++;
                }
                if (checker(Data.Announced, fullhouse) && fullhouseQ > 0) {
                    Nomatch = false;
                    dataToSend.fullhouse.push(element.TambolaTicketNumber);
                    fullhouseQ--;
                }

                if (Nomatch)
                    dataToSend.luckydraw.push(element.TambolaTicketNumber);

            }
            else {
                const intersection = fullhouse.filter(element => Data.Announced.includes(element));
                if (intersection.length >= 5 && claimed < 2) {
                    //change div to show class
                    Nomatch = false;
                    dataToSend.jaldi5.push(element.TambolaTicketNumber);
                    claimed++;
                }

                if (checker(Data.Announced, toprow) && claimed < 2) {
                    Nomatch = false;
                    dataToSend.toprow.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (checker(Data.Announced, middlerow) && claimed < 2) {
                    Nomatch = false;
                    dataToSend.middlerow.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (checker(Data.Announced, lastrow) && claimed < 2) {
                    Nomatch = false;
                    dataToSend.lastrow.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (checker(Data.Announced, fourcorners) && claimed < 2) {
                    Nomatch = false;
                    dataToSend.corners.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (checker(Data.Announced, fullhouse)) {
                    Nomatch = false;
                    dataToSend.fullhouse.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (Nomatch)
                    dataToSend.luckydraw.push(element.TambolaTicketNumber);

            }

        });

        dataToSend.count.fullhouse = dataToSend.fullhouse.length;
        dataToSend.count.toprow = dataToSend.toprow.length;
        dataToSend.count.middlerow = dataToSend.middlerow.length;
        dataToSend.count.lastrow = dataToSend.lastrow.length;
        dataToSend.count.jaldi5 = dataToSend.jaldi5.length;
        dataToSend.count.corners = dataToSend.corners.length;
        dataToSend.count.luckydraw = dataToSend.luckydraw.length;
        dataToSend.ticketArray = ticketArray;
        return { Success: true, Data: dataToSend }
    }

    *TSCOneFullhousePatttern(Data) {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]]);
        let result = yield UserDetails.find({ Session: sessionresult.Session }, { TambolaTicketNumber: 1, TambolaTicket: 1 });
        var ticketArray = [];
        var dataToSend = {
            fullhouse: [],
            toprow: [],
            middlerow: [],
            lastrow: [],
            jaldi5: [],
            corners: [],
            luckydraw: [],
            count: { fullhouse: Number, toprow: Number, middlerow: Number, lastrow: Number, jaldi5: Number, corners: Number, luckydraw: Number }
        }

        var c = null;
        var fullhouseQ = 0;
        var toprowQ = 0;
        var middlerowQ = 0;
        var lastrowQ = 0;
        var jaldi5rowQ = 0;
        var cornersrowQ = 0;

        if (Data.Quota) {
            c = yield Coins.findOne({ Game: 'FullHousie' });
            fullhouseQ = c.Quota;
            c = yield Coins.findOne({ Game: 'TopRow' });
            toprowQ = c.Quota;
            c = yield Coins.findOne({ Game: 'MiddleRow' });
            middlerowQ = c.Quota;
            c = yield Coins.findOne({ Game: 'BottomRow' });
            lastrowQ = c.Quota;
            c = yield Coins.findOne({ Game: 'JaldiFive' });
            jaldi5rowQ = c.Quota;
            c = yield Coins.findOne({ Game: 'Corners' });
            cornersrowQ = c.Quota;
        }

        console.log(fullhouseQ);
        console.log(toprowQ);
        console.log(middlerowQ);
        console.log(lastrowQ);
        console.log(jaldi5rowQ);
        console.log(cornersrowQ);


        result.forEach(element => {

            let checker = (arr, target) => target.every(v => arr.includes(v));

            var fullhouse = [];
            var fourcorners = [];
            var lastrow = [];
            var toprow = [];
            var middlerow = [];

            var firstcorner = 0;
            var lastcorner = 0;

            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.third[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    lastrow.push(currentvalue);
                    if (lastcorner <= 0)
                        lastcorner = currentvalue;
                    firstcorner = currentvalue;
                    fullhouse.push(currentvalue);
                }
            }
            fourcorners.push(firstcorner);
            fourcorners.push(lastcorner);

            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.second[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    middlerow.push(currentvalue);
                    fullhouse.push(currentvalue);
                }
            }

            firstcorner = 0;
            lastcorner = 0;
            for (let step = 8; step >= 0; step--) {
                var currentvalue = element.TambolaTicket.first[step];
                if (currentvalue > 0) {
                    if (ticketArray[currentvalue] == null)
                        ticketArray[currentvalue] = 0
                    ticketArray[currentvalue] = ticketArray[currentvalue] + 1;
                    toprow.push(currentvalue);
                    if (lastcorner <= 0)
                        lastcorner = currentvalue;
                    firstcorner = currentvalue;
                    fullhouse.push(currentvalue);
                }
            }
            fourcorners.push(firstcorner);
            fourcorners.push(lastcorner);


            
            var Nomatch = true;
            var claimed = 0;

            if (Data.Quota) {
                const intersection = fullhouse.filter(element => Data.Announced.includes(element));
                if (intersection.length >= 5 && jaldi5rowQ > 0 && claimed < 1) {
                    //change div to show class
                    Nomatch = false;
                    dataToSend.jaldi5.push(element.TambolaTicketNumber);
                    jaldi5rowQ--;
                    claimed++;
                }

                if (checker(Data.Announced, toprow) && toprowQ > 0 && claimed < 1) {
                    Nomatch = false;
                    dataToSend.toprow.push(element.TambolaTicketNumber);
                    toprowQ--;
                    claimed++;
                }
                if (checker(Data.Announced, middlerow) && middlerowQ > 0 && claimed < 1) {
                    Nomatch = false;
                    dataToSend.middlerow.push(element.TambolaTicketNumber);
                    middlerowQ--;
                    claimed++;
                }
                if (checker(Data.Announced, lastrow) && lastrowQ > 0 && claimed < 1) {
                    Nomatch = false;
                    dataToSend.lastrow.push(element.TambolaTicketNumber);
                    lastrowQ--;
                    claimed++;
                }
                if (checker(Data.Announced, fourcorners) && cornersrowQ > 0 && claimed < 1) {
                    Nomatch = false;
                    dataToSend.corners.push(element.TambolaTicketNumber);
                    cornersrowQ--;
                    claimed++;
                }

                if (checker(Data.Announced, fullhouse) && fullhouseQ > 0 && claimed < 2) {
                    Nomatch = false;
                    dataToSend.fullhouse.push(element.TambolaTicketNumber);
                    fullhouseQ--;
                    claimed++;
                }

                if (Nomatch)
                    dataToSend.luckydraw.push(element.TambolaTicketNumber);

            }
            else {
                
                const intersection = fullhouse.filter(element => Data.Announced.includes(element));
                if (intersection.length >= 5 && claimed < 1) {
                    //change div to show class
                    Nomatch = false;
                    dataToSend.jaldi5.push(element.TambolaTicketNumber);
                    claimed++;
                }

                if (checker(Data.Announced, toprow) && claimed < 1) {
                    Nomatch = false;
                    dataToSend.toprow.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (checker(Data.Announced, middlerow) && claimed < 1) {
                    Nomatch = false;
                    dataToSend.middlerow.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (checker(Data.Announced, lastrow) && claimed < 1) {
                    Nomatch = false;
                    dataToSend.lastrow.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (checker(Data.Announced, fourcorners) && claimed < 1) {
                    Nomatch = false;
                    dataToSend.corners.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (checker(Data.Announced, fullhouse) && claimed < 2) {
                    Nomatch = false;
                    dataToSend.fullhouse.push(element.TambolaTicketNumber);
                    claimed++;
                }
                if (Nomatch)
                    dataToSend.luckydraw.push(element.TambolaTicketNumber);

            }

        });

        dataToSend.count.fullhouse = dataToSend.fullhouse.length;
        dataToSend.count.toprow = dataToSend.toprow.length;
        dataToSend.count.middlerow = dataToSend.middlerow.length;
        dataToSend.count.lastrow = dataToSend.lastrow.length;
        dataToSend.count.jaldi5 = dataToSend.jaldi5.length;
        dataToSend.count.corners = dataToSend.corners.length;
        dataToSend.count.luckydraw = dataToSend.luckydraw.length;
        dataToSend.ticketArray = ticketArray;
        return { Success: true, Data: dataToSend }
    }
}

module.exports = TambolaService;