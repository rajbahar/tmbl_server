'use strict';
const QuizService=require('../Service/QuizService');
const _QuizService=new QuizService();

class QuizController{
    constructor(){}

    *DeleteQuiz(request,response){
        const data=request.body;
        const result= yield _QuizService.DeleteQuiz(data);
        response.json(result);
        response.end();
    }

    *UpdateQuiz(request,response){
        const data=request.body;
        const result= yield _QuizService.UpdateQuiz(data);
        response.json(result);
        response.end();
    }

    *SubmitQuiz(request,response){
        const data=request.body;
        const result= yield _QuizService.SubmitQuiz(data);
        response.json(result);
        response.end();
    }

    *FetchAllQuiz(request,response){
        const result= yield _QuizService.FetchAllQuiz();
        response.json(result);
        response.end();
    }

    *FetchOneQuiz(request,response){
        const result= yield _QuizService.FetchOneQuiz();
        response.json(result);
        response.end();
    }

    *ValidateQuiz(request,response){
        const data=request.body;
        const result= yield _QuizService.ValidateQuiz(data);
        response.json(result);
        response.end();
    }
}

module.exports=QuizController;
