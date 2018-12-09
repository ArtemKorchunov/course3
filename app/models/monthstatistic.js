'use strict';
module.exports = (sequelize, DataTypes) => {
  const MonthStatistic = sequelize.define(
    'MonthStatistic',
    {
      quantity: DataTypes.INTEGER,
      average: DataTypes.INTEGER
    },
    {}
  );
  MonthStatistic.associate = function (models) {
    MonthStatistic.belongsTo(models.Sensor, {
      foreignKey: 'sensor_id'
    });
    MonthStatistic.belongsTo(models.Month, {
      foreignKey: 'month_id'
    });
    return MonthStatistic;
  };
  return MonthStatistic;
};
