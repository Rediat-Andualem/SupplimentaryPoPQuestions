// models/Courses.js

module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define(
    'Courses',
    {
      courseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      courseName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      courseActiveStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Courses.associate = (models) => {
    Courses.hasMany(models.QuestionAndAnswerTable, {
      foreignKey: "courseId",
      onDelete: "CASCADE",
    });
  };

  return Courses;
};
