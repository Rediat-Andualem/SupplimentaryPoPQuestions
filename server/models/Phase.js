// models/Courses.js

module.exports = (sequelize, DataTypes) => {
  const Phase = sequelize.define(
    'Phase',
    {
      phaseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      phaseName: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      timestamps: true,
    }
  );
  return Phase;
};
