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
  TemperatureLevel.associate = function () { };
  return TemperatureLevel;
};
