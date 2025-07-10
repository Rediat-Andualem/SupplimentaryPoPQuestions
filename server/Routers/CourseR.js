const express = require('express');
const {createCourse,getAllCourses,deleteCourse } = require('../Controllers/CourseC.js'); 
const {checkRole,authenticateToken} = require('../Auth/Auth.js')

let CourseRouter = express.Router();


CourseRouter.post('/createCourse',authenticateToken,checkRole(["1","2"]), createCourse);  
CourseRouter.get('/getAllCourses', getAllCourses);  
CourseRouter.delete('/deleteCourse/:courseId',authenticateToken,checkRole(["1","2"]), deleteCourse);  


module.exports = {CourseRouter};