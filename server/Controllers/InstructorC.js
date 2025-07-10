const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op, where } = require('sequelize');
const jwt = require("jsonwebtoken");
const {Instructor,sequelize} = require("../models");
const nodemailer = require('nodemailer')

const registerInstructor = async (req, res) => {
  const {
    instructorFirstName,
    instructorLastName,
    instructorEmail,
    instructorPassword,
    instructorAssignedCourse,
    instructorVerification,
    instructorActiveStatus,
    instructorRole,
  } = req.body;

  const errors = [];

  if (!instructorFirstName || !instructorLastName || !instructorEmail || !instructorPassword || !instructorAssignedCourse) {
    errors.push("All fields are required");
  }

  if (instructorPassword.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await Instructor.findOne({ where: { instructorEmail } });

    if (existingUser) {
      return res.status(400).json({ errors: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(instructorPassword, salt);

    const InstructorProfile = await Instructor.create({
        instructorFirstName,
        instructorLastName,
        instructorEmail,
        instructorAssignedCourse,
        instructorPassword:hashPassword,
        instructorVerification,
        instructorActiveStatus,
        instructorRole
      });
      const authToken = jwt.sign(
        {
          instructorId: InstructorProfile.instructorId,
          instructorFirstName:InstructorProfile.instructorFirstName,
          instructorEmail: InstructorProfile.instructorEmail,
          instructorAssignedCourse: InstructorProfile.instructorAssignedCourse,
          instructorVerification:InstructorProfile.instructorVerification,
          instructorActiveStatus:InstructorProfile.instructorActiveStatus,
          instructorRole: InstructorProfile.instructorRole,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.setHeader("Authorization", `Bearer ${authToken}`);
      res.status(201).json({ message: "User profile created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

const instructorLogIn = async (req,res)=>{
const { instructorEmail, instructorPassword } = req.body;
console.log(instructorEmail, instructorPassword)
  if (!instructorEmail || !instructorPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const checkInstructor = await Instructor.findOne({ where: { instructorEmail } });

    if (!checkInstructor) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(instructorPassword, checkInstructor.instructorPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // JWT payload
    const payload = {
          instructorId: checkInstructor.instructorId,
          instructorFirstName:checkInstructor.instructorFirstName,
          instructorEmail: checkInstructor.instructorEmail,
          instructorAssignedCourse: checkInstructor.instructorAssignedCourse,
          instructorVerification:checkInstructor.instructorVerification,
          instructorActiveStatus:checkInstructor.instructorActiveStatus,
          instructorRole: checkInstructor.instructorRole,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d"
    });

    // Set token in response header
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
}

// register karegu behuwla confirm lemarege
const InstructorVerification = async (req,res)=>{
    const {instructorId}= req.body
    try {
          const InstructorCheck = await Instructor.findByPk(instructorId);
    if (!InstructorCheck) {
      return res.status(404).json({ message: "Instructor not found" });
    }
      InstructorCheck.instructorVerification=true
      await InstructorCheck.save()
      return res.status(200).json({ message: "Instructor verification successfully" });
    } catch (error) {
      console.error("Instructor verification: ", error.message);
      return res.status(500).json({ error: error.message });
    }
}

// account active or deactivate lemarege
const InstructorActiveDeactive = async (req, res) => {
    const { instructorId } = req.body;

    try {
        const InstructorCheck = await Instructor.findByPk(instructorId);

        if (!InstructorCheck) {
            return res.status(404).json({ message: "Instructor not found" });
        }

        let deactivationMessage;

        if (InstructorCheck.instructorActiveStatus === true) {
            InstructorCheck.instructorActiveStatus = false;
            deactivationMessage = "deactivated";
        } else {
            InstructorCheck.instructorActiveStatus = true;
            deactivationMessage = "activated";
        }

        await InstructorCheck.save();

        return res.status(200).json({
            message: `Instructor profile ${deactivationMessage} successfully`,
        });

    } catch (error) {
        console.error("Instructor active/deactive error: ", error.message);
        return res.status(500).json({ error: error.message });
    }
};


//  delete instructor profile 

const deleteInstructorProfile = async (req,res)=>{
 const { instructorId } = req.params; 
  const t = await sequelize.transaction();

  try {
    const checkInstructor = await Instructor.findByPk(instructorId, { transaction: t });

    if (!checkInstructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Prevent deleting superAdmin (role = 3)
    if (checkInstructor.instructorRole === "1") {
      return res.status(400).json({ message: "Admin cannot be deleted." });
    }
    await checkInstructor.destroy({ transaction: t });

    await t.commit();
    res.json({ message: "Instructor deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Delete instructor error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}



// clear unconfirmed user 
const deleteUnconfirmedUsers = async (req, res) => {
  const t = await sequelize.transaction();

  try {

    const unconfirmedUsers = await Instructor.findAll({
      where: { instructorVerification: false },
      transaction: t,
    });

    if (unconfirmedUsers.length === 0) {
      return res.status(200).json({ message: "No unconfirmed users found to delete." });
    }

  
    for (const user of unconfirmedUsers) {
      await user.destroy({ transaction: t });
    }

    await t.commit();

    res.status(200).json({
      message: `Successfully deleted ${unconfirmedUsers.length} unconfirmed user(s).`,
    });
  } catch (error) {
    await t.rollback();
    console.error("Delete unconfirmed users error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// get instructors for verification 

const getInstructorsForVerification = async (req,res)=>{
 try {
    const unverifiedInstructors = await Instructor.findAll({
      where: { instructorVerification: false },
      attributes: {
        exclude: ['instructorPassword'], 
      },
      order: [['createdAt', 'DESC']], 
    });

    if (unverifiedInstructors.length === 0) {
      return res.status(200).json({ message: "No unverified instructors found." });
    }

    return res.status(200).json(unverifiedInstructors);
  } catch (error) {
    console.error("Fetch unverified instructors error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// get all instructor profile
const getAllInstructorsProfile = async (req, res) => {
  try {
    const instructors = await Instructor.findAll({
      attributes: {
        exclude: ["instructorPassword"], 
      },
      order: [["createdAt", "DESC"]], 
    });

    if (instructors.length === 0) {
      return res.status(200).json({
        message: "No instructors found.",
      });
    }

    return res.status(200).json(instructors);
  } catch (error) {
    console.error("Fetch instructors error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// update instructor role 
const updateInstructorRole = async (req,res)=>{
const { instructorId, role} = req.body;
  try {
    const instructor = await Instructor.findByPk(instructorId);

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found." });
    }

    if (instructor.instructorRole === "1") {
      return res.status(400).json({
        message: "Super admin role cannot be modified.",
      });
    }

    // Optional: Validate the role input
    const validRoles = ["0", "1", "2", "3", "4"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role provided.",
      });
    }

    instructor.instructorRole = role;
    await instructor.save();

    return res.status(200).json({
      message: "Instructor role updated successfully.",
      updatedInstructor: {
        instructorId: instructor.instructorId,
        instructorFirstName: instructor.instructorFirstName,
        instructorLastName: instructor.instructorLastName,
        instructorEmail: instructor.instructorEmail,
        instructorRole: instructor.instructorRole,
      },
    });
  } catch (error) {
    console.error("Update instructor role error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}


const forgotPassword = async (req, res) => {
  const { instructorEmail } = req.body;
 console.log(req.body)
  try {
    const findInstructor = await Instructor.findOne({
      attributes: ["instructorId", "instructorEmail"],
      where: { instructorEmail },
    });

    if (!findInstructor) {
      return res.status(404).json({ message: "Password Reset Email sent!." });
    }

    const updateLink = `${process.env.FRONTEND_URL}/reset-password/${findInstructor.instructorId}`;
    const mailSender = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContent = {
      from: process.env.EMAIL_USER,
      to: findInstructor.instructorEmail,
      subject: "Password Reset Request",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Update Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f6f6f6;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  border: 1px solid #cccccc;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  max-width: 100px;
              }
              .content {
                  text-align: center;
                  padding: 20px;
              }
              .cta-button {
                  display: inline-block;
                  padding: 15px 25px;
                  margin: 20px 0;
                  background-color: #A34054;
                  color: #ffffff !important;
                  font-weight: bold;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  text-align: center;
                  padding: 10px 0;
                  font-size: 12px;
                  color: #777777;
              }
          </style>
      </head>
      <body>
          <div class="container">
               <div class="header">
        </div>
              <div class="content">
                  <h1>Update your password</h1>
                  <p>Click the button below to update your password.</p>
                  <a href="${updateLink}" class="cta-button">Update Password</a>
          </div>
          <div class="footer">
              <p>Link will expire in <b>5min</b><p>
              <br>
              <p>If you did not sign up for this account, please ignore this email.</p>
          </div>
      </div>
      </body>
      </html>
    `,
    };

    mailSender.sendMail(emailContent, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Error sending email." });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ message: "Password reset email sent." });
      }
    });

  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};


const updateUserPassword = async (req, res) => {
  const { user_new_password } = req.body;
  const { instructorId } = req.params;
  try {
    const userData = await Instructor.findOne({
      attributes: ["instructorId"],
      where: { instructorId },
    });

    if (!userData) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_new_password, salt);

    const [updated] = await Instructor.update(
      {
        instructorPassword: hashedPassword,
      },
      { where: { instructorId } }
    );

    if (updated > 0) {
      return res.status(200).json({ message: "Password updated successfully." });
    } else {
      return res.status(500).json({ message: "Failed to update password." });
    }
  } catch (error) {
    console.error("Error updating password:", error.message);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};


module.exports = {
  registerInstructor,
  InstructorVerification,
  InstructorActiveDeactive,
  deleteInstructorProfile,
  deleteUnconfirmedUsers,
  getInstructorsForVerification,
  getAllInstructorsProfile,
  instructorLogIn,
  updateInstructorRole,
  forgotPassword,
  updateUserPassword
};