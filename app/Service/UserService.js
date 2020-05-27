'use strict'
var otpGenerator = require('otp-generator')
var request = require("request-promise");
var _ = require('lodash')

const User = require('../Model/User');
const Coins = require('../Model/Coins');
const SessionDetails = require('../Model/Session');
const UserDetails = require('../Model/UserDetails');
const Zone = require('../Model/Zone');
const TambolaService = require('../Service/TambolaService');
const _tambolaService = new TambolaService();


class UserService {
    constructor() { }

    *Login(data) {

        let result = yield User.findOne({
            Phone: data.Phone
        });

        // console.log(result)

        if (!result) {
            return { Success: false, Data: "User not exist." }
        }

        let OTP = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false, digits: true });

        let SMSResult = yield this.sendSMS(data, OTP);
        result.OTP = OTP;
        yield result.save();


        return { Success: true, Data: result, SMSResult: SMSResult }

    }

    *Register(data) {
        // console.log(data)
        if (data.R_id == '' || data.R_id == null) {
            data.R_id = null;
        }
        let referral_User = yield User.findOne({ _id: data.R_id });

        delete data.R_id;
        data.AllCoins = [{ Game: 'Referral', Coin: 0 }]
        // console.log(data)
        let result = yield User.findOne({
            Phone: data.Phone
        });

        if (result) {
            return { Success: false, Data: "User already exist." }
        }

        result = new User(data);

        let OTP = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false, digits: true });

        let SMSResult = yield this.sendSMS(data, OTP);
        result.OTP = OTP;

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

        return { Success: true, Data: result, SMSResult: SMSResult }

    }


    *sendSMS(data, OTP) {

        var options = {
            method: 'POST',
            url: process.env.SMSAPI,
            form:
            {
                method: 'sendMessage',
                send_to: '91' + data.Phone,
                msg: 'Your OTP to play CliQbola is ' + OTP + '. Best of luck!',
                msg_type: 'TEXT',
                userid: process.env.SMSUID,
                auth_scheme: 'PLAIN',
                password: process.env.SMSPASSWORD,
                format: 'JSON'
            }
        };
        const server_Respone = request(options)
            .then((htmlString) => {
                return { Success: true, Data: htmlString };
            })
            .catch((err) => {
                return { Success: false, Data: err };
            });

        return server_Respone;
    }

    *sendChunkSMS(send_to,msg) {
        
        var URL=process.env.SMSAPI+'?method=SendMessage&send_to='+send_to+'&msg='+msg+'&msg_type=TEXT&userid='+process.env.SMSUID+'&auth_scheme=plain&password='+process.env.SMSPASSWORD+'&v=1.1&format=text';

        const server_Respone = request(URL)
            .then((htmlString) => {
                return { Success: true, Data: htmlString };
            })
            .catch((err) => {
                return { Success: false, Data: err };
            });

        return server_Respone;
    }


    *OTP_verify(data) {

        let existing = yield User.findOne({
            Phone: data.Phone,
            OTP: data.OTP
        });

        if (!existing) {
            return { Success: false, Data: "Incorrect OTP. Please try again" }
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
            // console.log('-----------')
            return { Success: true };
        } else {
            // console.log('-----***********------')
            return { Success: false };
        }
    }

    *SetReminder(data) {
        let result = yield User.findOne({ Phone: data.Phone });
        if (!result) {
            return { Success: false, Data: "User not found." }
        }
        result.setReminder = true;
        yield result.save();
        return { Success: true, Data: result }

    }

    *sendReminderSMS() {

        let result = yield User.find({ setReminder: true });
        if (!result) {
            return { Success: false, Data: "No user has subscribed for SMS reminder." }
        }

        //send sms for each 
        let PhoneArr = [];
        //all phone number in array format
        for (let index = 0; index < result.length; index++) {
            PhoneArr.push(result[index].Phone);
        }

        // PhoneArr = ['8976752466', '8779038089', '9769098408'];
        //phone array split in chuck of 1000 user
        let PhoneChunkData = _.chunk(PhoneArr, 1000)

        // console.log(PhoneChunkData);

        let smsResponse=[]
        //send SMS in chunk
        for (let index = 0; index < PhoneChunkData.length; index++) {

            let send_to=PhoneChunkData[index].toString();
            let msg='Welcome to SMS GupShup API ';

            //send sms API

           // smsResponse.push(yield this.sendChunkSMS(send_to,msg))
        }


        return { Success: true, Data: "SMS Sent successfully" ,Response:smsResponse}
    }


    *DeleteUser(data) {

        let result = yield User.findOneAndDelete({
            Phone: data.Phone
        });

        if (!result) {
            return { Success: false, Data: "data not found" }
        }

        return { Success: true, Data: result }
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
        let CurrentDiscount = 0;
        let CurrentPercent = 0
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
                CurrentDiscount = element.Discount;
                CurrentPercent = element.Off;

                for (let index_2 = 0; index_2 < zoneList.length; index_2++) {
                    const NextElement = zoneList[index_2];

                    if ((element.Max + 1) == NextElement.Min) {
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
            Discount: CurrentDiscount,
            Off: CurrentPercent,
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