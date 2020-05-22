'use strict'
var otpGenerator = require('otp-generator')
const User = require('../Model/User');
const Coins=require('../Model/Coins');
const SessionDetails=require('../Model/Session');
const UserDetails=require('../Model/UserDetails');

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
        let referral_User= yield User.findOne({_id:data.R_id});
   
        delete data.R_id;
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

        if(referral_User){

           let c= yield Coins.findOne({ Game: 'Referral'});

           if(c){

            result.coins= (result.coins+c.Coins);
            //max referral count number
            if(referral_User.MaxCount<3){
                referral_User.MaxCount=referral_User.MaxCount+1;
                referral_User.coins=(referral_User.coins+c.Coins)
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

        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let UserDetailresult=yield UserDetails.findOne({Phone:data.Phone,Session:sessionresult.Session}, {});

        let response = {
            _id:existing._id,
            Name: existing.Name,
            Email:existing.Email,
            Phone: existing.Phone,
            City: existing.City,
            Role:'User',
            UserDetails: UserDetailresult
        }
        return { Success: true, Data: response }

    }

    *getUserByID(data) {
        const existing = yield User.findOne({
            _id: data._id
        });
        if (existing) {
            
            return { Success: true };
        } else {
            return { Success: false };
        }
    }

    *getProfile(data){
  
        let existing = yield User.findOne({
            Phone: data.Phone
        },{ Name: 1, coins: 1,_id: 0 });

        if (!existing) {
            return { Success: false, Data: "User not found" }
        }
      
        return { Success: true,Data:existing };
    }

    *GetReferralLink(data){
        let result = yield User.findOne( {   Phone: data.Phone }, { _id: 1} );
        if (!result) {
            return { Success: false, Data: "User not found." }
        }
        let link='http://13.234.143.20:3005/register.html?id='+result._id;
        return { Success: true, Data: link }
    }

    *List() {
        let result = yield User.find( { }, { _id: 0, OTP: 0 ,__v:0} );
        return { Success: true, Data: result }
    }

    *RegisterSimuLate(data){

        let limit=parseInt(data.limit)
        let st=10000;
        let end=st+limit;
        // console.log(st,end)
        for (let index = st; index < end; index++) {
            let d= {
             Name:"Raj",
             Email : "raj@gmail.com",
             Phone:""+index,
             City:"mumbai",
            R_id:null
            }
            let result = new User(d);
            result.OTP = '1234';
            yield result.save();
            let p={
                Phone:""+index,
            }
            yield _tambolaService.GenerateTicket(p)
        }
      

       return {Success:true,Data:'Simulation done'}
     

    }

}

module.exports = UserService;