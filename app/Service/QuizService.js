'use strict'

const Quiz=require('../Model/Quiz');
const SessionDetails=require('../Model/Session');
const UserDetails=require('../Model/UserDetails');


class QuizService{
    constructor(){}

    *DeleteQuiz(data){
     
        let result = yield Quiz.findOneAndDelete({
           _id:data._id
        });

        if(!result){
            return {Success:false,Data:"Quiz not found"}
        }

        return {Success:true,Data:result}

    }

    *UpdateQuiz(data){
     
        let result = yield Quiz.findOneAndUpdate({
           _id:data._id
        },{ $set: { submittedBy: data.submittedBy } });

        if(!result){
            return {Success:false,Data:"Quiz not found"}
        }

        return {Success:true,Data:result}

    }

    *SubmitQuiz(data){
         let result = new Quiz(data);
         yield result.save();

         return {Success:true,Data:result}
 
    }

    *FetchAllQuiz(){
        let result=yield Quiz.find();
        return {Success:true,Data:result}
    }

    *FetchOneQuiz(data){
        let result=yield Quiz.findOne({_id:data._id}, {__v:0,submittedBy:0,submittedDate:0,answer:0});        
        return {Success:true,Data:result}
    }

    *ValidateQuiz(data){
        let result=yield Quiz.findOne({_id:data._id});
        if(!result){
            return {Success:false,Data:"Quiz not found"}
        }
        let sessionresult=yield SessionDetails.findOne({}).sort([['Session', -1]])
        let userresult=yield UserDetails.findOne({ Phone:data.Phone,Session:sessionresult.Session});
        if(!userresult)
            return {Success:false,Date:"User not found"}
        
        if(!userresult.Quiz)
            userresult.Quiz= [];

        if(data.answer == result.answer)
        {
            userresult.Quiz.push({_id:result._id,answer:true})
            console.log(userresult.Quiz);
            let updateresult = yield UserDetails.findOneAndUpdate({
                Phone:data.Phone,Session:sessionresult.Session
                },{ $set: { Quiz: userresult.Quiz } });
            
            return {Success:true,Date:"Correct Answer"}
        }
        else
        {
            userresult.Quiz.push({_id:result._id,answer:true})
            console.log(userresult.Quiz);
            let updateresult = yield UserDetails.findOneAndUpdate({
                Phone:data.Phone,Session:sessionresult.Session
                },{ $set: { Quiz: userresult.Quiz } });
            
            return{Success:false,Data:"Wrong Answer"}
        }
    }

  
}

module.exports=QuizService;