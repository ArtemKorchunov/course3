'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define(
    'Device',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.BOOLEAN
    },
    {}
  );
  Device.associate = function (models) {
    Device.belongsToMany(models.Chart, {
      through: 'DeviceCharts',
      foreignKey: 'device_id'
    });
    Device.belongsTo(models.DeviceCategorie, {
      foreignKey: 'categorie_id'
    });
  };
  return Device;
};
