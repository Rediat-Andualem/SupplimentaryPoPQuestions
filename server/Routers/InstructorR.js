const express = require('express');
const {registerInstructor,instructorLogIn,InstructorVerification,InstructorActiveDeactive,deleteInstructorProfile,updateInstructorRole ,deleteUnconfirmedUsers,forgotPassword,getAllInstructorsProfile,getInstructorsForVerification,updateUserPassword} = require('../Controllers/InstructorC.js'); 
const {checkRole,authenticateToken,} = require('../Auth/Auth.js')

let InstructorRouter = express.Router();


InstructorRouter.post('/createInstructorProfile', registerInstructor);  
InstructorRouter.post('/instructorLogin', instructorLogIn);  
InstructorRouter.post('/verifyInstructor',authenticateToken,checkRole(['1','2']),InstructorVerification);  
InstructorRouter.post('/actdeacInstructor',authenticateToken,checkRole(['1','2']),InstructorActiveDeactive);  
InstructorRouter.delete('/deleteInstructor/:instructorId',authenticateToken,checkRole(['1','2']),deleteInstructorProfile);  
InstructorRouter.delete('/deleteUnConfirmedUser',authenticateToken,checkRole(['1','2']),deleteUnconfirmedUsers);  
InstructorRouter.get('/getAllForVerification',authenticateToken,checkRole(['1','2']),getInstructorsForVerification);  
InstructorRouter.get('/getAllInstructors',authenticateToken,checkRole(['1','2']),getAllInstructorsProfile);  
InstructorRouter.put('/updateInstructorRole',authenticateToken,checkRole(['1','2']),updateInstructorRole);  
InstructorRouter.post('/emailForPassword',forgotPassword);  
InstructorRouter.post('/updatePassword/:instructorId',updateUserPassword);  


module.exports = {InstructorRouter};