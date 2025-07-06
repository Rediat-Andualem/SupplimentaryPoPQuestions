const express = require("express");
const {InstructorRouter} = require('./Routers/InstructorR')
const {CourseRouter} = require('./Routers/CourseR')
const {QuestionRoute} = require('./Routers/QuestionR')


const AllRouters = express.Router();


AllRouters.use('/Instructor',InstructorRouter)

AllRouters.use('/Course',CourseRouter)
AllRouters.use('/Question',QuestionRoute)

module.exports={AllRouters}
