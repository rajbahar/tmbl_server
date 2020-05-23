'use strict'
var otpGenerator = require('otp-generator')
const User = require('../Model/User');
const Coins = require('../Model/Coins');
const SessionDetails = require('../Model/Session');
const UserDetails = require('../Model/UserDetails');
const Zone = require('../Model/Zone');

class UserService {
    constructor() { }

    *Login(data) {

        let result = yield User.findOne({
            Phone: data.Phone
        });

        if (!result) {
            return { Success: false, Data: "User not found" }
        }

        let OTP = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false, digits: true });
        result.OTP = '1234';
        yield result.save();

        return { Success: true, Data: result }

    }

    *Register(data) {
        // console.log(data)
        let referral_User = yield User.findOne({ _id: data.R_id });

        delete data.R_id;
        data.AllCoins=[{ Game: 'Referral', Coin: 0 }]
        // console.log(data)
        let result = yield User.findOne({
            Phone: data.Phone
        });

        if (result) {
            return { Success: false, Data: "User already exist" }
        }

        result = new User(data);

        let OTP = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false, digits: true });
        result.OTP = '1234';

        if (referral_User) {

            let c = yield Coins.findOne({ Game: 'Referral' });

            if (c) {

                result.AllCoins.push({ Game: 'Referred', Coin: c.Coins });
                
                result.coins = (result.coins + c.Coins);
                //max referral count number
                if (referral_User.MaxCount < 3) {
                    referral_User.MaxCount = referral_User.MaxCount + 1;
                    referral_User.coins = (referral_User.coins + c.Coins)

                    for (let index = 0; index < referral_User.AllCoins.length; index++) {
                        const element = referral_User.AllCoins[index];
                        if (element.Game == 'Referral') {
                            referral_User.AllCoins[index].Coin = referral_User.AllCoins[index].Coin + c.Coins;
                        }
                    }

                    yield referral_User.save();
                }

            }
        }
       
       
        yield result.save();

        return { Success: true, Data: result }

    }

    *OTP_verify(data) {

        let existing = yield User.findOne({
            Phone: data.Phone,
            OTP: data.OTP
        });

        if (!existing) {
            return { Success: false, Data: "User not found." }
        }

        let sessionresult = yield SessionDetails.findOne({}).sort([['Session', -1]])
        let UserDetailresult = yield UserDetails.findOne({ Phone: data.Phone, Session: sessionresult.Session }, {});

        let response = {
            _id: existing._id,
            Name: existing.Name,
            Email: existing.Email,
            Phone: existing.Phone,
            City: existing.City,
            Role: 'User',
            UserDetails: UserDetailresult
        }
        return { Success: true, Data: response }

    }

    *getUserByID(data) {
        const existing = yield User.findOne({
            _id: data._id,
            Phone: data.Phone
        });
        if (existing) {

            return { Success: true };
        } else {
            return { Success: false };
        }
    }

    *getProfile(data) {

        let existing = yield User.findOne({
            Phone: data.Phone
        }, { Name: 1, coins: 1, _id: 0 });

        if (!existing) {
            return { Success: false, Data: "User not found" }
        }

        return { Success: true, Data: existing };
    }

    *GetEarning(data) {
        let existingUser = yield User.findOne({
            Phone: data.Phone
        }, { Name: 1, coins: 1, _id: 0 });

        if (!existingUser) {
            return { Success: false, Data: "User not found" }
        }

        let CurrentZone = null;
        let NextZone = null;
        let RequiredCoin = 0;

        const zoneList = yield Zone.find();

        //current zone details
        for (let index = 0; index < zoneList.length; index++) {
            const element = zoneList[index];
            // ********************************************* 
            if (existingUser.coins >= 0 && existingUser.coins < element.Min && element.Name == "Purple") {
                NextZone = element.Name;
                RequiredCoin = element.Max - existingUser.coins;
                break;
            }
            // ****************************************************
            if (existingUser.coins >= element.Min && existingUser.coins <= element.Max) {
                // console.log(element);
                CurrentZone = element.Name;

                for (let index_2 = 0; index_2 < zoneList.length; index_2++) {
                    const NextElement = zoneList[index_2];

                    if (element.Max < NextElement.Min) {
                        // console.log(element,NextElement)
                        NextZone = NextElement.Name;
                        RequiredCoin = NextElement.Min - existingUser.coins;
                        break;
                    }
                }


            }
            // *****************************************
        }
        //check coin zone 
        //check purple zone
        //perr   max 100000
        //next zone
        //zexzonemin-cuurent coin 
        //get zone

        let response = {
            TotalCoins: existingUser.coins,
            CurrentZone: CurrentZone,
            NextZone: NextZone,
            RequiredCoin: RequiredCoin
        }

        return { Success: true, Data: response }


    }

    *GetCoinsDetails(data) {
        let existingUser = yield User.findOne({ Phone: data.Phone });
        if (!existingUser) {
            return { Success: false, Data: "User not found." }
        }
        return { Success: true, Data: existingUser }
    }


    *GetReferralLink(data) {
        let result = yield User.findOne({ Phone: data.Phone }, { _id: 1 });
        if (!result) {
            return { Success: false, Data: "User not found." }
        }
        let link = 'http://13.234.143.20:3005/register.html?id=' + result._id;
        return { Success: true, Data: link }
    }

    *List() {
        let result = yield User.find({}, { _id: 0, OTP: 0, __v: 0 });
        return { Success: true, Data: result }
    }

    *RegisterSimuLate(data) {

        let limit = parseInt(data.limit)
        let st = 10000;
        let end = st + limit;
        // console.log(st,end)
        for (let index = st; index < end; index++) {
            let d = {
                Name: "Raj",
                Email: "raj@gmail.com",
                Phone: "" + index,
                City: "mumbai",
                R_id: null
            }
            let result = new User(d);
            result.OTP = '1234';
            yield result.save();
            let p = {
                Phone: "" + index,
            }
            yield _tambolaService.GenerateTicket(p)
        }


        return { Success: true, Data: 'Simulation done' }


    }

}

module.exports = UserService;