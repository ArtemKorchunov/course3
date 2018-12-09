'use strict';
module.exports = (sequelize, DataTypes) => {
  const TemperatureLevel = sequelize.define(
    'TemperatureLevel',
    {
      cool: DataTypes.INTEGER,
      medium: DataTypes.INTEGER,
      hight: DataTypes.INTEGER
    },
    {}
  );
  TemperatureLevel.associate = function (models) {
    return TemperatureLevel.belongsTo(models.Sensor, {
      foreignKey: 'sensor_id'
    });
  };
  return TemperatureLevel;
};
