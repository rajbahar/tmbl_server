'use strict'

const Quiz=require('../Model/Quiz');

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

    *FetchOneQuiz(){
        let result=yield Quiz.findOne({}, {__v:0,submittedBy:0,submittedDate:0,answer:0});
        
        return {Success:true,Data:result}
    }

    *ValidateQuiz(data){
        let result=yield Quiz.findOne({_id:data._id});
        if(!result){
            return {Success:false,Data:"Quiz not found"}
        }
        if(data.answer == result.answer)
        {
            return {Success:true,Date:"Correct Answer"}
        }
        else
        {
            return{Success:false,Data:"Wrong Answer"}
        }
    }
}

module.exports=QuizService;