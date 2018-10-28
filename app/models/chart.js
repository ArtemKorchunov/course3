'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chart = sequelize.define(
    'Chart',
    {
      name: DataTypes.STRING
    },
    {
      timestamp: false
    }
  );
  Chart.associate = function (models) {
    Chart.belongsToMany(models.Device, {
      through: 'DeviceChart',
      foreignKey: 'chart_id'
    });
  };
  return Chart;
};
