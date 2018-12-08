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
    return Sensor.belongsTo(models.Device, {
      foreignKey: 'device_id'
    });
  };
  return Sensor;
};
