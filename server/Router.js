const express = require("express");
const {InstructorRouter} = require('./Routers/InstructorR')
const {CourseRouter} = require('./Routers/CourseR')


const AllRouters = express.Router();


AllRouters.use('/Instructor',InstructorRouter)
AllRouters.use('/Course',CourseRouter)


module.exports={AllRouters}
