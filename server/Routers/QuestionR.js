// routes/questionRoutes.js

const express = require("express");
const { questionAnswerUpload } = require("../Middleware/multerConfig");
const multerUploadHandler = require("../Middleware/multerUploadHandler");
const { uploadQuestionAndAnswer,sendAnswerFiles,sendQuestionFiles ,deleteQuestionAndAnswer,getAllQuestions} = require("../Controllers/QuestionC");
const {checkRole,authenticateToken,} = require('../Auth/Auth.js')

const QuestionRoute = express.Router();

QuestionRoute.post("/upload-question/:instructorId/:courseId",authenticateToken,multerUploadHandler(questionAnswerUpload),uploadQuestionAndAnswer);
QuestionRoute.get('/getQuestion/:questionFileName',authenticateToken, sendQuestionFiles);
QuestionRoute.get('/getAllQ&A/:courseId',authenticateToken, getAllQuestions);
QuestionRoute.get('/getAnswer/:answerFileName',authenticateToken, sendAnswerFiles);
QuestionRoute.delete('/deleteQandA/:questionAndAnswerId',authenticateToken, deleteQuestionAndAnswer);

module.exports = {QuestionRoute};

// file sending should be there 

// file delete should be there 


// file deletion for those files which are not in the database but in the resource (crone)