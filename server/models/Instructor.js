const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Instructor = sequelize.define(
    "Instructor",
    {
      instructorId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      instructorFirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      instructorLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      instructorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      instructorPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      instructorAssignedCourse: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      instructorVerification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      instructorActiveStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      instructorRole: {
        type: DataTypes.ENUM("0", "1", "2", "3", "4"),
        defaultValue: "0",
      },
    },
    {
      timestamps: true,
    }
  );

  Instructor.associate = (models) => {
    Instructor.hasMany(models.QuestionAndAnswerTable, {
      foreignKey: "instructorId",
      onDelete: "CASCADE",
    });
  };


  Instructor.ensureSuperAdminExists = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      salt
    );

    await Instructor.findOrCreate({
      where: { instructorEmail: "rediat_ta@ch.iitr.ac.in" },
      defaults: {
        instructorFirstName: "Rediat",
        instructorLastName: "Terefe",
        instructorAssignedCourse: "",
        instructorVerification: true,
        instructorActiveStatus: true,
        instructorPassword: hashedPassword,
        instructorRole: "1", 
      },
    });
  };

  return Instructor;
};
