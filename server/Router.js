const express = require("express");
const {InstructorRouter} = require('./Routers/InstructorR')
const {CourseRouter} = require('./Routers/CourseR')
const {QuestionRoute} = require('./Routers/QuestionR')
const {PhaseAndWeekRoute} = require('./Routers/WeekAndPhaseR')


const AllRouters = express.Router();


AllRouters.use('/Instructor',InstructorRouter)
AllRouters.use('/Course',CourseRouter)
AllRouters.use('/Question',QuestionRoute)
AllRouters.use('/WeekAndPhase',PhaseAndWeekRoute)

module.exports={AllRouters}
