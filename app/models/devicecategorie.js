'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeviceCategorie = sequelize.define(
    'DeviceCategorie',
    {
      name: DataTypes.STRING
    },
    {}
  );
  DeviceCategorie.associate = function () {
    // associations can be defined here
  };
  return DeviceCategorie;
};
