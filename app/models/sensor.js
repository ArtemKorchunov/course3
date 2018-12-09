'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sensor = sequelize.define(
    'Sensor',
    {
      identifier: DataTypes.STRING,
      name: DataTypes.STRING
    },
    {}
  );
  Sensor.associate = function (models) {
    Sensor.belongsTo(models.Device, {
      foreignKey: 'device_id'
    });
    Sensor.hasOne(models.TemperatureLevel, {
      foreignKey: 'sensor_id'
    });
    Sensor.hasOne(models.MonthStatistic, {
      foreignKey: 'sensor_id'
    });
    return Sensor;
  };
  return Sensor;
};
