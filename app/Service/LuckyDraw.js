'use strict'

const UserDetails = require('../Model/UserDetails');
const SessionDetails = require('../Model/Session');
var randomBoolean = require('random-boolean');
const Coins = require('../Model/Coins');

class LuckyDrawService {
    constructor() { }

    *OptLuckyDraw(data) {
        var success= false;
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult = yield UserDetails.findOne({ Phone: data.Phone, Session: sessionresult.Session });
        if (!userresult)
            return { Success: false, Data: "User not found" }

        yield UserDetails.findOneAndUpdate({
            Phone: data.Phone, Session: sessionresult.Session
        }, { $set: { LuckyDraw: { opt: true, win: false } } });

        if (randomBoolean() && randomBoolean() && randomBoolean()) {
            let c = yield Coins.findOne({ Game: 'LuckyDraw' });

            if (c) {
                if (c.Quota < 1) {
                    return { Success: false, Data: 'LuckyDraw' }
                }
                c.Quota = c.Quota - 1;
                yield c.save();
                success =true;
            }            
        }

        let updateresult = yield UserDetails.findOne({ Phone: data.Phone, Session: sessionresult.Session });
        return { Success: success, Data: 'LuckyDraw' }
    }

    *SelectLuckyDraw(data) {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult = yield UserDetails.findOne({ Phone: data.Phone, Session: sessionresult.Session });
        if (!userresult)
            return { Success: false, Data: "User not found" }

        yield UserDetails.findOneAndUpdate({
            Phone: data.Phone, Session: sessionresult.Session
        }, { $set: { LuckyDraw: { opt: true, win: true } } });

        let updateresult = yield UserDetails.findOne({ Phone: data.Phone, Session: sessionresult.Session });

        //add lucky draw coins 
        let result = yield User.findOne({
            Phone: data.Phone
        });
        let c = yield Coins.findOne({ Game: 'LuckyDraw' });
        if (c) {
            result.coins = (result.coins + c.Coins)
        }
        yield result.save();


        return { Success: true, Data: updateresult }
    }

    *FetchOptedLuckyDraw() {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult = yield UserDetails.find({
            Session: sessionresult.Session,
            'LuckyDraw.opt': true
        });
        console.log(userresult);
        return { Success: true, Data: userresult }
    }

    *FetchWinners() {
        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])

        let userresult = yield UserDetails.find({
            Session: sessionresult.Session,
            'LuckyDraw.win': true
        });
        return { Success: true, Data: userresult }
    }

}

module.exports = LuckyDrawService;