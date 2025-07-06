const express = require('express');
const {createCourse } = require('../Controllers/CourseC.js'); 
const {checkRole,authenticateToken} = require('../Auth/Auth.js')

let CourseRouter = express.Router();


CourseRouter.post('/createCourse',authenticateToken,checkRole(["1","2"]), createCourse);  


module.exports = {CourseRouter};