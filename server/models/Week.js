module.exports = (sequelize, DataTypes) => {
  const Week = sequelize.define(
    'Week',
    {
      WeekId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      WeekName: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      timestamps: true,
    }
  );
  return Week;
};
