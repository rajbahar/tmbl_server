'use strict'
var otpGenerator = require('otp-generator')
const User = require('../Model/User');
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

        let result = yield User.findOne({
            Phone: data.Phone
        });

        if (result) {
            return { Success: false, Data: "User already exist" }
        }

        result = new User(data);

        let OTP = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false, digits: true });
        result.OTP = '1234';

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

    *List() {
        let result = yield User.find( { }, { _id: 0, OTP: 0 ,__v:0} );
        return { Success: true, Data: result }
    }

}

module.exports = UserService;