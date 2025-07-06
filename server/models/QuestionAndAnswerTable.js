// models/QuestionAndAnswerTable.js

module.exports = (sequelize, DataTypes) => {
  const QuestionAndAnswerTable = sequelize.define(
    "QuestionAndAnswerTable",
    {
      questionAndAnswerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      instructorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Instructors", 
          key: "instructorId",
        },
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Courses",
          key: "courseId",
        },
      },
      phase: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      week: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      titleOfTheWeek: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      questionReferenceLink: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      AnswerReferenceLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      additionalRecourseLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );


  QuestionAndAnswerTable.associate = (models) => {
    QuestionAndAnswerTable.belongsTo(models.Instructor, {
      foreignKey: "instructorId",
      onDelete: "CASCADE",
    });

    QuestionAndAnswerTable.belongsTo(models.Courses, {
      foreignKey: "courseId",
      onDelete: "CASCADE",
    });
  };

  return QuestionAndAnswerTable;
};
