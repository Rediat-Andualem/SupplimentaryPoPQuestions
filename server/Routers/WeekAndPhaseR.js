// routes/questionRoutes.js

const express = require("express");

const {createPhase,createWeek,deletePhase,deleteWeek,getAllPhases,getAllWeeks } = require("../Controllers/PhaseAndWeekManager.js");
const {checkRole,authenticateToken,} = require('../Auth/Auth.js')

const PhaseAndWeekRoute = express.Router();


PhaseAndWeekRoute.post('/createPhase',authenticateToken,checkRole(['1','2']), createPhase);
PhaseAndWeekRoute.delete('/deletePhase/:phaseId',authenticateToken,checkRole(['1','2']), deletePhase);
PhaseAndWeekRoute.post('/createWeek',authenticateToken,checkRole(['1','2']), createWeek);
PhaseAndWeekRoute.delete('/deleteWeek/:WeekId',authenticateToken,checkRole(['1','2']), deleteWeek);
PhaseAndWeekRoute.get('/getAllWeek',authenticateToken,getAllWeeks)
PhaseAndWeekRoute.get('/getAllPhases',authenticateToken,getAllPhases)

module.exports = {PhaseAndWeekRoute};
