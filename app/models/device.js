'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define(
    'Device',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );
  Device.associate = function (models) {
    Device.belongsToMany(models.ChartType, {
      through: 'DeviceChart',
      foreignKey: 'device_id'
    });
  };
  return Device;
};
