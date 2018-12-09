'use strict';
module.exports = (sequelize, DataTypes) => {
  const Month = sequelize.define('Month', {
    name: DataTypes.STRING
  }, {});
  Month.associate = function(models) {
    // associations can be defined here
  };
  return Month;
};