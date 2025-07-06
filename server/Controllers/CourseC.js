
const {Courses} = require("../models");

const createCourse = async (req,res)=>{
const {
    courseName,
    courseActiveStatus,
  } = req.body;

  const errors = [];

  if (!courseName) {
    errors.push("Course name is required!");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingCourse = await Courses.findOne({ where: { courseName } });

    if (existingCourse) {
      return res.status(400).json({ errors: "Course name is already in use" });
    }


    const createCourseProfile = await Courses.create({
        courseName,
      });

      res.status(201).json({ message: "Course profile created successfully", createCourseProfile});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
}


module.exports = {
  createCourse
};